const purchaser = require('./purchaserModel')
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
                           
            let useObj = new user()
            useObj.name = req.body.name
            useObj.email = req.body.email
            useObj.password = bcrypt.hashSync(req.body.password,roundValue)
            
            useObj.save()
            .then(
                (userRes) =>{
                let purchaserObj = new purchaser()
                purchaserObj.name = req.body.name
                purchaserObj.email = req.body.email
                purchaserObj.password = req.body.password
                purchaserObj.contact = req.body.contact
                purchaserObj.address = req.body.address
               
                purchaserObj.city = req.body.city
                purchaserObj.state = req.body.state
                 purchaserObj.pincode = req.body.pincode
                purchaserObj.userId = userRes._id
                purchaserObj.save()
                .then((cuRes) =>{
                   useObj.purchaserId = cuRes._id
                   useObj.save()
                   .then(() =>{
                    res.json({
                        status:200,
                        success:true,
                        message:"User Registered Successfully",
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
    const totalCount = await purchaser.countDocuments().exec()
    purchaser.find()
    .then((purchaserData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:purchaserData,
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
        purchaser.findOne({_id:req.body._id})
        .then((purchaserData) =>{
            if(!purchaserData){
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
                    data:purchaserData
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
        purchaser.findOne({_id:req.body._id})
        .then((purchaserData) =>{
            if(!purchaserData)
            {
                res.json({
                    status:404,
                    success:false,
                    message:"Data not found"
                })
            }
            else{
                (async () => {
                    
                if(req.body.name)
                {
                    purchaserData.name = req.body.name
                }
                if(req.body.contact)
                    {
                    purchaserData.contact = req.body.contact
                    }
                if(req.body.address)
                    {
                    purchaserData.address = req.body.address
                    }
              

                if(req.body.state){
                purchaserData.state = req.body.state
                }
                 if(req.body.pincode){
                purchaserData.pincode = req.body.pinCode
                }
               
                purchaserData.save()
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
       purchaser.findOne({ _id: req.body._id })
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