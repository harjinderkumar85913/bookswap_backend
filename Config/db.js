const mongoose = require("mongoose")
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
.then(() =>{
    console.log("DATABASE CONNECTED")
})
.catch((err) =>{
    console.log(err)
})