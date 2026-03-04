const cart = require("./cartModel")
const Razorpay = require("razorpay")

const add = async (req, res) => {
    let validationError = [];

    if (!req.body.purchaserId) validationError.push("purchaserId is required");
    if (!req.body.bookId) validationError.push("bookId is required");
    if (!req.body.sellerId) validationError.push("sellerId is required");

    if (validationError.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: "Validation error occurred",
            error: validationError
        });
    }

    try {
        const { purchaserId, bookId, sellerId } = req.body;

        // 🔎 Find ACTIVE (UNPAID) cart item only
        const existingCart = await cart.findOne({
            purchaserId,
            bookId,
            paymentStatus: "Pending",
            status: "Active"
        });

        // ✅ If unpaid cart exists → increment quantity
        if (existingCart) {
            existingCart.quantity += 1;

            await existingCart.save();

            return res.json({
                status: 200,
                success: true,
                message: "Cart quantity updated",
                action: "incremented",
                data: existingCart
            });
        }

        // ✅ Else create NEW cart item (even if same book was paid earlier)
        const cartObj = new cart({
            purchaserId,
            sellerId,
            bookId,
            quantity: 1,
            paymentStatus: "Pending",
            status: "Active"
        });

        const savedCart = await cartObj.save();

        res.json({
            status: 200,
            success: true,
            message: "Book added to cart successfully",
            action: "added",
            data: savedCart
        });

    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "Internal server error",
            errors: err.message
        });
    }
};

getall = async (req, res) => {
    const totalCount = await cart.countDocuments().exec()
    cart.find(req.body).populate("purchaserId").populate("sellerId").populate("bookId")
        .then((cartData) => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: cartData,
                count: totalCount
            })
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errors: err.message
            })
        })
}

getsingle = (req, res) => {
    const validationError = []
    if (!req.body._id) {
        validationError.push("id is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "validation error occurs",
            error: validationError
        })
    }
    else {
        cart.findOne({ _id: req.body._id }).populate("bookId")
            .then((cartData) => {
                if (!cartData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Data not found"
                    })
                }
                else {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Data loaded successfully",
                        data: cartData
                    })
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal serverv error",
                    errors: err.message
                })
            })
    }

}




updateStatus = (req, res) => {
    let validationErrors = []

    if (!req.body._id) {
        validationErrors.push("id is required")
    }
    if (validationErrors.length > 0) {
        res.json({
            status: 422,
            succcess: false,
            message: "validation errors",
            errors: validationErrors
        })
    }
    else {
        cart.findOne({ _id: req.body._id })
            .then((ress => {
                // console.log(ress)
                if (ress == null) {
                    res.json({
                        message: "No Data found",
                        status: 404,
                        success: false
                    })
                }
                else {
                    if (req.body.status) {
                        ress.status = req.body.status
                    }
                    if (req.body.orderStatus) {
                        ress.orderStatus = req.body.orderStatus
                    }
                    if (req.body.increment) {
                        ress.quantity += Number(req.body.increment);


                        // if quantity becomes 0 → deactivate cart
                        if (ress.quantity <= 0) {
                            ress.quantity = 0;
                            ress.status = "Inactive";
                        }
                    }

                    ress.save()
                        .then(rec => {
                            res.json({
                                message: "Status Updated Successfully ",
                                status: 200,
                                success: true,
                                data: ress
                            })
                        })
                }
            }))
            .catch(err => {
                // console.log(err)
                res.json({
                    message: err,
                    status: 500,
                    success: false
                })
            })
    }
}


const pay = async (req, res) => {
    try {
        const { purchaserId } = req.body;

        if (!purchaserId) {
            return res.status(400).json({ success: false, message: "purchaserId required" });
        }

        const carts = await cart.find({
            purchaserId,
            status: "Active",
            paymentStatus: "Pending",
        }).populate("bookId");

        if (!carts.length) {
            return res.status(404).json({ success: false, message: "No active cart items" });
        }

        let totalAmount = 0;
        carts.forEach(item => {
            totalAmount += (Number(item.bookId.price) || 0) * item.quantity;
        });

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        // ✅ DO NOT MARK PAID HERE
        await cart.updateMany(
            { purchaserId, status: "Active", paymentStatus: "Pending" },
            {
                $set: {
                    razorpayOrderId: order.id,
                    paymentType: 1,
                    totalPayment: totalAmount,
                },
            }
        );

        res.status(200).json({
            success: true,
            order,
            totalAmount,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId } = req.body;

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const payments = await razorpay.orders.fetchPayments(razorpayOrderId);

        if (!payments.items.length) {
            // ❗ No payment → stay Pending
            return res.json({ status: "Pending" });
        }

        const payment = payments.items[0];

        if (payment.status === "captured") {
            await cart.updateMany(
                { razorpayOrderId },
                { $set: { paymentStatus: "Paid" } }
            );
            return res.json({ status: "Paid" });
        }

        // failed / created / authorized → Pending
        return res.json({ status: "Pending" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



module.exports = {
    add,
    getall,
    getsingle,
    pay,
    updateStatus,
    verifyPayment
}


