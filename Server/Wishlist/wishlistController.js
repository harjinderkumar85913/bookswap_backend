const Wishlist = require("./wishlistModel");

/**
 * ADD / REMOVE (TOGGLE) WISHLIST
 */
exports.toggleWishlist = async (req, res) => {
  try {
    const { purchaserId, bookId } = req.body;

    if (!purchaserId || !bookId) {
      return res.json({
        success: false,
        message: "PurchaserId and BookId required",
      });
    }

    const exists = await Wishlist.findOne({ purchaserId, bookId });

    if (exists) {
      await Wishlist.deleteOne({ _id: exists._id });
      return res.json({
        success: true,
        message: "Removed from wishlist",
        action: "removed",
      });
    }

    await Wishlist.create({ purchaserId, bookId });

    return res.json({
      success: true,
      message: "Added to wishlist",
      action: "added",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        success: false,
        message: "Already in wishlist",
      });
    }

    return res.json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET USER WISHLIST
 */
exports.getWishlist = async(req,res) =>{
    const totalCount = await Wishlist.countDocuments().exec()
    Wishlist.find(req.body).populate("purchaserId").populate("bookId")
    .then((WishlistData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:WishlistData,
            count:totalCount
        })
    })
    .catch((err) =>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error",
            errors:err.message
        })
    })
}