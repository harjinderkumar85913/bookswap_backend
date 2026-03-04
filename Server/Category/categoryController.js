const category = require('./categoryModel')
const { uploadImg } = require('../../cloudinaryConfig');

const add = async (req, res) => {
    let validationError = [];

    if (!req.body.categoryName) {
        validationError.push("categoryName is required");
    }
    if (!req.file) {
        validationError.push("Category Image is required");
    }
 
     if (!req.body.description) {
        validationError.push("description is required");
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
        const existingCategory = await category.findOne({ categoryName: req.body.categoryName });
        if (existingCategory) {
            return res.json({
                status: 422,
                success: false,
                message: "Data already exists",
                data: existingCategory
            });
        }

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

        const categoryObj = new category({
            categoryName: req.body.categoryName,
            categoryImage: image ,
            description: req.body.description
        });

        const savedcategory = await categoryObj.save();
        res.json({
            status: 200,
            success: true,
            message: "Data added successfully",
            data: savedcategory
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
    const totalCount = await category.countDocuments().exec()
    category.find()
    .then((categoryData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:categoryData,
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
        category.findOne({_id:req.body._id})
        .then((categoryData) =>{
            if(!categoryData){
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
                    data:categoryData
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
        const categoryData = await category.findOne({ _id: req.body._id });

        if (!categoryData) {
            return res.json({
                status: 404,
                success: false,
                message: "Data not found"
            });
        }

        
        if (req.body.categoryName) {
            categoryData.categoryName = req.body.categoryName;
        }

        
        if (req.file) {
            try {
                const imageUrl = await uploadImg(req.file.buffer, `bookSwap/${Date.now()}`);
                categoryData.categoryImage = imageUrl;
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
        if (req.body.description) {
            categoryData.description = req.body.description;
        }

        const resSave = await categoryData.save();
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
       category.findOne({ _id: req.body._id })
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
