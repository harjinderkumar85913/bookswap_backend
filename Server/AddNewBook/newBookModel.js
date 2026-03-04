const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title:{ type: String, default:null },
    author:{ type: String, default:null },
    categoryId:{type:mongoose.Schema.Types.ObjectId,default:null, ref:"categories"},
    condition:{ type: String, default:null },
    description:{ type: String, default:null },
    price:{ type: String, default:null },
    sellerId:{type:mongoose.Schema.Types.ObjectId,default:null, ref:"sellers"},
    image:{ type: String, default:null },
    swapAvailable:{ type: String, default:null },
    status: { type: String, default: "Active" },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("newbooks", bookSchema)  