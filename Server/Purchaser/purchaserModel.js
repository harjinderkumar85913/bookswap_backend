const mongoose = require("mongoose")

const purchaserSchema = new mongoose.Schema({
    name:{type:String,default:null},
    email:{type:String,default:null},
    password:{type:String,default:null},
    contact:{type:String,default:null},
    address:{type:String,default:null},
    city:{type:String,default:null},
    state:{type:String,default:null},
    pincode:{type:String,default:null},
    userId:{type:mongoose.Schema.Types.ObjectId,default:null, ref:"users"},
    userType:{type:Number,default:3},
    status:{type:String,default:"Active"},
    createdAt:{type:Date,default:Date.now()}
})

module.exports = new mongoose.model("purchasers",purchaserSchema)