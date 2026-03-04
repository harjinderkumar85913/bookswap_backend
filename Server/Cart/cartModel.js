const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    purchaserId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "purchasers" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "sellers" },
    bookId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "newbooks" },
    paymentType: { type: Number, default: 0 }, // 0=unpaid, 1=razorpay
    paymentStatus: { type: String, default: "Pending" },
    razorpayOrderId: { type: String, default: null },
    quantity: {type: Number,default: 1,min: 1},
   totalPayment: { type: String, default: null },
    status: { type: String, default: "Active" },
    orderStatus: { type: String, default: "Order Placed" },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("carts", cartSchema)  