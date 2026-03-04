const newBook = require('./newBookModel')
const { uploadImg } = require('../../cloudinaryConfig');

const add = async (req, res) => {
    let validationError = [];

    if (!req.body.title) {
        validationError.push("title is required");
    }
    if (!req.body.author) {
        validationError.push("newBook Image is required");
    }
     if (!req.body.price) {
        validationError.push("price is required");
    }
     
     if (!req.body.sellerId) {
        validationError.push("sellerId is required");
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

        const newBookObj = new newBook({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            newBookId: req.body.newBookId,
            sellerId: req.body.sellerId,
             categoryId: req.body.categoryId,
            condition: req.body.condition,
            image: image ,
            description: req.body.description
        });

        const savednewBook = await newBookObj.save();
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

getall = async(req,res) =>{
    const totalCount = await newBook.countDocuments().exec()
    newBook.find(req.body).populate("categoryId").populate("sellerId")
    .then((newBookData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:newBookData,
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

getsingle = (req,res) =>{
    const validationError = []
    if(!req.body._id){
        validationError.push("id is required")
    }
    if(validationError.length > 0){
        res.json({
            status:422,
            success:false,
            message:"validation error occurs",
            error:validationError
        })
    }
    else{
        newBook.findOne({_id:req.body._id})
        .then((newBookData) =>{
            if(!newBookData){
                res.json({
                    status:404,
                    success:false,
                    message:"Data not found"
                })
            }
            else{
                res.json({
                    status:200,
                    success:true,
                    message:"Data loaded successfully",
                    data:newBookData
                })
            }
        })
        .catch((err) =>{
            res.json({
                status:500,
                success:false,
                message:"Internal serverv error",
                errors:err.message
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
        const newBookData = await newBook.findOne({ _id: req.body._id });

        if (!newBookData) {
            return res.json({
                status: 404,
                success: false,
                message: "Data not found"
            });
        }

        
        if (req.body.title) {
            newBookData.title = req.body.title;
        }

        
        if (req.file) {
            try {
                const imageUrl = await uploadImg(req.file.buffer, `bookSwap/${Date.now()}`);
                newBookData.image = imageUrl;
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
        if (req.body.author) {
            newBookData.author = req.body.author;
        }
         if (req.body.categoryId) {
            newBookData.categoryId = req.body.categoryId;
        }
         if (req.body.condition) {
            newBookData.condition = req.body.condition;
        }
         if (req.body.description) {
            newBookData.description = req.body.description;
        }
         if (req.body.price) {
            newBookData.price = req.body.author;
        }
        const resSave = await newBookData.save();
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


updateStatus = (req,res)=>{
    let validationErrors=[]

    if(!req.body._id){
        validationErrors.push("id is required")
    }
    if(validationErrors.length>0){
        res.json({
            status:422,
            succcess:false,
            message:"validation errors",
            errors:validationErrors
        })
    }
    else {
       newBook.findOne({ _id: req.body._id })
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
                    ress.status = req.body.status
                    ress.save()
                        .then(rec => {
                            res.json({
                                message: "Status Updated Successfully ",
                                status: 200,
                                success: true,
                                data:ress
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

module.exports = {
    add,
    getall,
    getsingle,
    updateData,
    updateStatus
}


