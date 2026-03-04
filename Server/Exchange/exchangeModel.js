const mongoose = require("mongoose")

const exchnageSchema = new mongoose.Schema({
    purchaserId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "purchasers" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "sellers" },
    newBookId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "newBooks" },
    title: { type: String, default: null },
    author: { type: String, default: null },
    condition: { type: String, default: null },
    description: { type: String, default: null },
    offeredPrice: { type: String, default: null },
    image: { type: String, default: null },
    paymentType: { type: Number, default: 0 }, // 0=unpaid, 1=razorpay
    paymentStatus: { type: String, default: "Pending" },
    razorpayOrderId: { type: String, default: null },
    status: { type: String, default: "Pending" },
    orderStatus: { type: String, default: "Request Placed" },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("exchanges", exchnageSchema)  