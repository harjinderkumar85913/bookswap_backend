const query = require("./queryModel")
const add = async (req, res) => {
    let validationError = [];

    if (!req.body.name) {
        validationError.push("name is required");
    }
    if (!req.body.email) {
        validationError.push("email is required");
    }
 
     if (!req.body.subject) {
        validationError.push("subject is required");
    }
     if (!req.body.message) {
        validationError.push("message is required");
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
       

        const queryObj = new query({
            name: req.body.name,
           email: req.body.email ,
           subject: req.body.subject,
           message: req.body.subject
        });

        const savedQuery = await queryObj.save();
        res.json({
            status: 200,
            success: true,
            message: "Query added successfully",
            data: savedQuery
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
    const totalCount = await query.countDocuments().exec()
    query.find()
    .then((queryData) =>{
        res.json({
            status:200,
            success:true,
            message:"Data loaded successfully",
            data:queryData,
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

module.exports = {
    add,
    getall
}