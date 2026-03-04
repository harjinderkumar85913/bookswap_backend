const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    purchaserId: { type: mongoose.Schema.Types.ObjectId, ref: "purchasers" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "newbooks" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "sellers" },
    reviewMessage: { type: String, default: null },
    rating: { type: String, default: null },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("reviews", reviewSchema);