const user = require("./userModel")
const bcrypt = require('bcrypt')

const privateKey = "myproject123"
const jwt = require("jsonwebtoken")


login = (req, res) => {
    let validationError = []
    if (!req.body.email) {
        validationError.push("Email is required")
    }
    if (!req.body.password) {
        validationError.push("Password is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "validation error occurs",
            error: err.message
        })
    }
    else {
        user.findOne({ email: req.body.email })
            .then((userData) => {
                if (!userData) {
                    res.json({
                        status: 422,
                        success: false,
                        message: "email not matched"
                    })
                }
                else {
                    bcrypt.compare(req.body.password, userData.password, function (err, result) {
                        if (result) {
                            var payload = {
                                name: userData.name,
                                email: userData.email,
                                userType: userData.userType,
                                userId: userData._id
                            }
                            var token = jwt.sign(payload, privateKey)
                            res.json({
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                token: token,
                                data: userData
                            })
                        }
                        else {
                            res.json({
                                status: 422,
                                success: false,
                                message: "Invalid password",

                            })
                        }
                    })
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal serverr error",
                    errors: err.message
                })
            })
    }
}

const changePassword = (req, res) => {
    let validation = ''
    if (!req.body._id) {
        validation += '_id is required'
    }
    if (!req.body.currentPassword) {
        validation += 'currentPassword is required'
    }
    if (!req.body.newPassword) {
        validation += 'newPassword is required'
    }
    if (!req.body.confirmPassword) {
        validation += 'confirmPassword is required'
    }

    if (!!validation) {
        res.send({
            success: false,
            status: 400,
            message: 'Validation error' + validation
        })
    }
    else {
        user.findOne({ _id: req.body._id })
            .then((userData) => {
                if (userData == null) {
                    res.send({
                        success: false,
                        status: 404,
                        message: "Account does not exist"
                    })

                }
                else {
                    if (bcrypt.compareSync(req.body.currentPassword, userData.password)) {

                        if (req.body.newPassword == req.body.confirmPassword) {
                            userData.password = bcrypt.hashSync(req.body.newPassword, 10)
                            userData.save().then((userData) => {
                                res.send({
                                    success: true,
                                    status: 200,
                                    message: "Password Changed",
                                    data: userData

                                })

                            }).catch((err) => {
                                res.send({
                                    success: false,
                                    status: 403,
                                    message: err.message
                                })

                            })
                        }
                        else {
                            res.json({
                                status: 422,
                                success: false,
                                message: "New password and confirm password not matched"
                            })
                        }
                    }
                    else {
                        res.send({
                            success: false,
                            status: 403,
                            message: 'Current Password does not match'
                        })

                    }

                }

            }).catch((err) => {
                res.send({
                    success: false,
                    status: 403,
                    message: err.message
                })


            })
    }
}

updateStatus = (req, res) => {
    let validationError = []
    if (!req.body._id) {
        validationError.push("id is required")
    }
    if (!req.body.status) {
        validationError.push("status is required")
    }
    if (validationError.length > 0) {
        res.json({
            status: 422,
            success: false,
            message: "Validation error occurs",
            error: validationError
        })
    }
    else {
        user.findOne({ _id: req.body._id })
            .then((userData) => {
                if (!userData) {
                    res.json({
                        status: 404,
                        success: false,
                        message: "Data not found"
                    })
                }
                else {
                    if (req.body.status) {
                        userData.status = req.body.status
                    }
                    userData.save()
                        .then(
                            (resSave) => {
                                res.json({
                                    status: 200,
                                    success: true,
                                    message: "Status Updated Successfully",
                                    data: resSave
                                })
                            }
                        )
                        .catch(
                            (err) => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error",
                                    errors: err.message
                                })
                            }
                        )
                }
            })
            .catch(
                (err) => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Internal server error",
                        errors: err.message
                    })
                }
            )
    }
}

module.exports = {
    login,
    updateStatus,
    changePassword
}