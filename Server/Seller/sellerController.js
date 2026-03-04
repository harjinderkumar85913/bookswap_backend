const seller = require('./sellerModel')
const user = require('../User/userModel')
const bcrypt = require('bcrypt')
const roundValue = 10
const {uploadImg} =require("../../cloudinaryConfig")

register = (req,res) =>{
    valiadtionError = []
    if(!req.body.name){
        valiadtionError.push("Name is required")
    }
    if(!req.body.email){
        valiadtionError.push("Email is required")
    }
    if(!req.body.password){
        valiadtionError.push("Password is required")
    }
    if(!req.body.contact){
        valiadtionError.push("Contact is required")
    }
    
    if(!req.file){
        valiadtionError.push("seller Image is required")
    }
    if(!req.body.shopName){
        valiadtionError.push("shopName is required")
    }
    if(!req.body.address){
        valiadtionError.push("address are required")
    }
    if(!req.body.city){
        valiadtionError.push("city are required")
    }
    if(!req.body.state){
        valiadtionError.push("state are required")
    }
    if(!req.body.pincode){
        valiadtionError.push("pincode are required")
    }

    if(valiadtionError.length > 0){
        res.json({
            status:422,
            success:false,
            message:"Validation error occurs",
            error:valiadtionError
        })
    }
    else{
        user.findOne({email:req.body.email})
        .then((userData) =>{
           if(!userData){
            (async () => {
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
            let useObj = new user()
            useObj.name = req.body.name
            useObj.email = req.body.email
            useObj.password = bcrypt.hashSync(req.body.password,roundValue)
            useObj.userType = 2
            useObj.status = "Inactive"
            useObj.save()
            .then(
                (userRes) =>{
                let sellerObj = new seller()
                sellerObj.name = req.body.name
                sellerObj.email = req.body.email
                sellerObj.password = req.body.password
                sellerObj.contact = req.body.contact
                sellerObj.address = req.body.address
                sellerObj.profileImage = image
                sellerObj.shopName = req.body.shopName
                sellerObj.city = req.body.city
                sellerObj.state = req.body.state
                 sellerObj.pincode = req.body.pincode
                sellerObj.userId = userRes._id
                sellerObj.save()
                .then((cuRes) =>{
                   useObj.sellerId = cuRes._id
                   useObj.save()
                   .then(() =>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Seller Registered Successfully",
                        data:cuRes
                    })
                   })
                })
                .catch((err) =>{
                    res.json({
                        status:500,
                        success:false,
                        message:"Internal server Error",
                        errors:err.message
                    })
                })
                }
            )
            .catch((err) =>{
                res.json({
                    status:500,
                    success:false,
                    message:"Internal server Error",
                    errors:err.message
                })
            })
        })(); // ← immediately invoke the async function
           }
           else{
            res.json({
                status:422,
                success:false,
                message:"User already exist",
                data:userData
            })
           }
        }
    )
    .catch((err) =>{
        res.json({
            status:500,
            success:false,
            message:"Internal server Error",
            errors:err.message
        })
    })
    }
}


getall = async(req,res) =>{
    const totalCount = await seller.countDocuments().exec()
    seller.find()
    .then((sellerData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:sellerData,
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
        seller.findOne({_id:req.body._id})
        .then((sellerData) =>{
            if(!sellerData){
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
                    data:sellerData
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

updateData = (req,res) =>{
    let validationError = []
    if(!req.body._id)
    {
    validationError.push("id is required")
    }
    if(validationError.length > 0)
    {
        res.json({
            status:422,
            success:false,
            message:"Validation error occurs",
            error:validationError
        })
    }
    else{
        seller.findOne({_id:req.body._id})
        .then((sellerData) =>{
            if(!sellerData)
            {
                res.json({
                    status:404,
                    success:false,
                    message:"Data not found"
                })
            }
            else{
                (async () => {
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
                if(req.body.name)
                {
                    sellerData.name = req.body.name
                }
                if(req.body.contact)
                    {
                    sellerData.contact = req.body.contact
                    }
                if(req.body.address)
                    {
                    sellerData.address = req.body.address
                    }
                if(req.file){
                    sellerData.profileImage = image
                }
                if(req.body.shopName){
                 sellerData.shopName = req.body.shopName
                }

                if(req.body.state){
                sellerData.state = req.body.state
                }
                 if(req.body.pincode){
                sellerData.pincode = req.body.pincode
                }
                  if(req.body.city){
                sellerData.city = req.body.city
                }
               
                sellerData.save()
                .then(
                    (resSave) =>{
                        res.json({
                            status:200,
                            success:true,
                            message:"Data Updated Successfully",
                            data:resSave
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
            })(); // ← immediately invoke the async function
            }
        })
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
}

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
       seller.findOne({ _id: req.body._id })
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
module.exports= {
    register,
    getall,
    getsingle,
    updateData,
    updateStatus
}