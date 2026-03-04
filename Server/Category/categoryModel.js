const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, default: null },

    categoryImage: { type: String, default: "no_img.jpg" },
    description: { type: String, default: null },

    status: { type: String, default: "Active" },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("categories", categorySchema)  