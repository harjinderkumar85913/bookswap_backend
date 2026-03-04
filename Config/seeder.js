const User = require("../Server/User/userModel")
const bcrypt = require("bcrypt")
const saltround = 10

adminseeder = () => {

    User.findOne({email:"admin@gmail.com"})
    .then(userdata=>{
        if(!userdata){
            let userObj = new User()
            userObj.name = "admin"
            userObj.email = "admin@gmail.com"
            userObj.password = bcrypt.hashSync("admin123",saltround)
            userObj.userType = 1
            userObj.save()
            console.log("Admin Seeded")
        }
        else{
            console.log("Admin already exists")
        }
    })
    .catch(err=>{
        console.log(err.message)
    })
}

module.exports = {
    adminseeder
}