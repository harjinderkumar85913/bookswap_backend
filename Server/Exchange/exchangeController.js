const exchange = require('./exchangeModel')
const { uploadImg } = require('../../cloudinaryConfig');
const Razorpay = require("razorpay")


const add = async (req, res) => {
    let validationError = [];


    if (!req.body.newBookId) {
        validationError.push("newBookId is required");
    }
    if (!req.body.purchaserId) {
        validationError.push("sellerId is required");
    }
    if (!req.body.title) {
        validationError.push("title is required");
    }
    if (!req.body.author) {
        validationError.push("author is required");
    }

    if (!req.body.condition) {
        validationError.push("condition is required");
    }
    if (!req.body.description) {
        validationError.push("description is required");
    }
    if (!req.file) {
        validationError.push("Image is required");
    }
    if (validationError.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: "Validation error occurred",
            error: validationError
        });
    }

    try {


        let image = "Attachment not available";
        if (req.file) {
            try {
                const imageUrl = await uploadImg(req.file.buffer, `bookSwap/${Date.now()}`);
                image = imageUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({
                    success: false,
                    status: 500,
                    message: "Image upload failed",
                    error: err.message || err
                });
            }
        }

        const exchangeObj = new exchange({
            newBookId: req.body.newBookId,
            purchaserId: req.body.purchaserId,
            sellerId: req.body.sellerId,
            title: req.body.title,
            author: req.body.author,


            condition: req.body.condition,
            image: image,
            description: req.body.description
        });

        const savednewBook = await exchangeObj.save();
        res.json({
            status: 200,
            success: true,
            message: "Data added successfully",
            data: savednewBook
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
    const totalCount = await exchange.countDocuments().exec()
    exchange.find(req.body).populate("purchaserId")
        .then((exchangeData) => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: exchangeData,
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
        exchange.findOne({ _id: req.body._id })
            .then((exchangeData) => {
                if (!exchangeData) {
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
                        data: exchangeData
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


const updateData = async (req, res) => {
    let validationError = [];

    if (!req.body._id) {
        validationError.push("ID is required");
    }

    if (validationError.length > 0) {
        return res.json({
            status: 422,
            success: false,
            message: "Validation error occurs",
            error: validationError
        });
    }

    try {
        const exchangeData = await exchange.findOne({ _id: req.body._id });

        if (!exchangeData) {
            return res.json({
                status: 404,
                success: false,
                message: "Data not found"
            });
        }


        if (req.body.title) {
            exchangeData.title = req.body.title;
        }



        if (req.body.author) {
            exchangeData.author = req.body.author;
        }

        if (req.body.condition) {
            exchangeData.condition = req.body.condition;
        }
        if (req.body.description) {
            exchangeData.description = req.body.description;
        }
        if (req.body.offeredPrice) {
            exchangeData.offeredPrice = req.body.offeredPrice;
        }
        if (req.body.status) {
            exchangeData.status = req.body.status;
        }

        const resSave = await exchangeData.save();
        res.json({
            status: 200,
            success: true,
            message: "Data updated successfully",
            data: resSave
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
        exchange.findOne({ _id: req.body._id })
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


pay = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "_id is required"
            });
        }

        const exchangeData = await exchange.findById(_id);

        if (!exchangeData) {
            return res.status(404).json({
                success: false,
                message: "Exchange request not found"
            });
        }

        const amount = Number(exchangeData.offeredPrice);

        if (!amount || isNaN(amount)) {
            return res.status(400).json({
                success: false,
                message: "Invalid offered price"
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${exchangeData._id}`,
        });

        // ✅ ONLY ORDER DATA
        exchangeData.razorpayOrderId = order.id;
        exchangeData.paymentStatus = "Pending";
        exchangeData.paymentType = 1;

        await exchangeData.save();

        return res.json({
            success: true,
            order,
            amount
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Payment initiation failed"
        });
    }
};


const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId } = req.body;

        if (!razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: "razorpayOrderId is required"
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const payments = await razorpay.orders.fetchPayments(razorpayOrderId);

        // 🔹 Default → Pending
        let paymentStatus = "Pending";

        if (payments.items && payments.items.length > 0) {
            const isCaptured = payments.items.some(
                payment => payment.status === "captured"
            );

            if (isCaptured) {
                paymentStatus = "Paid";

                await exchange.updateOne(
                    { razorpayOrderId },
                    { $set: { paymentStatus: "Paid" } }
                );
            }
        }

        return res.json({
            success: true,
            paymentStatus
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

module.exports = {
    add,
    getall,
    getsingle,
    updateData,
    updateStatus,
    pay,
    verifyPayment
}


