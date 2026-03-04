const jwt= require("jsonwebtoken")

const privateKey = "myproject123"

module.exports = (req,res,next) =>{
    var token = req.headers["authorization"]

    jwt.verify(token,privateKey,function(err,result){
        if(err==null){
            req.body = req.body || {}; 
            req.body["token"] = result
            next();
        }
        else{
            res.json({
                status:403,
                success:false,
                message:"Token not found,please login to proceed"
            })
        }
    })
}