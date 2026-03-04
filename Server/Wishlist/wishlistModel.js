const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    purchaserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchasers",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newbooks",
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

// prevent duplicate wishlist entry
wishlistSchema.index({ purchaserId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model("wishlist", wishlistSchema);