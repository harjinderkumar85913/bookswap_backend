const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name:{type:String,default:null},
    email:{type:String,default:null},
    password:{type:String,default:null},
    profileImage:{type:String,default:"no_image.jpg"},
    contact:{type:String,default:null},
    shopName:{type:String,default:null},
    address:{type:String,default:null},
    city:{type:String,default:null},
    state:{type:String,default:null},
    pincode:{type:String,default:null},
    userId:{type:mongoose.Schema.Types.ObjectId,default:null, ref:"users"},
    userType:{type:Number,default:2},
    status:{type:String,default:"Inactive"},
    createdAt:{type:Date,default:Date.now()}
})

module.exports = new mongoose.model("sellers",sellerSchema)