const review = require("./reviewModel")

add = (req, res) => {
    let validationError = []

    if (!req.body.purchaserId) {
        validationError.push("purchaser id is required")
    }
    if (!req.body.bookId) {
        validationError.push("book id is required")
    }
     if (!req.body.sellerId) {
        validationError.push("seller id is required")
    }
    if (!req.body.rating) {
        validationError.push("rating is required")
    }
    if (!req.body.reviewMessage) {
        validationError.push("review message is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation error occurrs",
            error: validationError
        })
    }
    else {

        let revObj = new review();
        revObj.purchaserId = req.body.purchaserId
        revObj.bookId = req.body.bookId
         revObj.sellerId = req.body.sellerId
        revObj.rating = req.body.rating
        revObj.reviewMessage = req.body.reviewMessage
        revObj.save()
            .then(
                (resSave) => {
                    res.json({
                        status: 200,
                        success: true,
                        message:"Data Inserted successfully",
                        data: resSave
                    })
                }
            )
            .catch(
                (err) => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Internal Server Error",
                        errors: err.message
                    })
                }
            )
    }
}

getall = async(req,res) =>{
    const count = await review.countDocuments(req.body).exec()

    review.find(req.body).populate("sellerId").populate("purchaserId").populate("bookId")
    .then(
        (ratingData)  =>{
            res.json({
                status:200,
                success:true,
                message:"Data loaded successfully",
                data:ratingData,
                count:count
            })
        }
    )
    .catch(
        (err) =>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error",
            errors:err.message
        })

        }
    )
}

module.exports = {
    add,
    getall
}