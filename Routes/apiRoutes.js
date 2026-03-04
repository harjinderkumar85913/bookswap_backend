const route = require("express").Router()

const multer = require("multer")

const storage = multer.memoryStorage();
const fileUpload = multer({ storage });

const categoryController = require("../Server/Category/categoryController")
const sellerController = require("../Server/Seller/sellerController")
const purchaserController = require("../Server/Purchaser/purchaserController")
const userController = require("../Server/User/userController")
const newBookController = require("../Server/AddNewBook/newBookController")
const exchangeController = require("../Server/Exchange/exchangeController")
const cartController = require("../Server/Cart/cartController")
const reviewController = require("../Server/Review/reviewController")
const queryController = require("../Server/Query/queryController")
const wishlistController = require("../Server/Wishlist/wishlistController")
//category
route.post("/category/add",fileUpload.single('categoryImage'),categoryController.add)
route.post("/category/getall",categoryController.getall)
route.post("/category/getsingle",categoryController.getsingle)
route.post("/category/update",fileUpload.single('categoryImage'),categoryController.updateData)
route.post("/category/updateStatus",categoryController.updateStatus)

//seller89
route.post("/seller/register",fileUpload.single('profileImage'),sellerController.register)
route.post("/seller/getall",sellerController.getall)
route.post("/seller/getsingle",sellerController.getsingle)
route.post("/seller/update",fileUpload.single('profileImage'),sellerController.updateData)
route.post("/seller/updateStatus",sellerController.updateStatus)

//purchaser
route.post("/purchaser/register",purchaserController.register)
route.post("/purchaser/getall",purchaserController.getall)
route.post("/purchaser/getsingle",purchaserController.getsingle)
route.post("/purchaser/update",purchaserController.updateData)
route.post("/purchaser/updateStatus",purchaserController.updateStatus)

//login -> User

route.post("/user/login",userController.login)

route.post("/user/updateStatus",userController.updateStatus)
route.post("/user/changePassword",userController.changePassword)

//new book -> By Seller
route.post("/newbook/add",fileUpload.single('image'),newBookController.add);
route.post("/newbook/getall",newBookController.getall);
route.post("/newbook/getsingle",newBookController.getsingle);
route.post("/newbook/update",fileUpload.single('image'),newBookController.updateData);
route.post("/newbook/updateStatus",newBookController.updateStatus)

//Exchange
route.post("/exchange/add",fileUpload.single('image'),exchangeController.add);
route.post("/exchange/getall",exchangeController.getall);
route.post("/exchange/getsingle",exchangeController.getsingle);
route.post("/exchange/update",fileUpload.single('image'),exchangeController.updateData);
route.post("/exchange/updateStatus",exchangeController.updateStatus)
route.post("/exchange/pay",exchangeController.pay)
route.post("/exchange/verifypayment",exchangeController.verifyPayment)

//cart 
route.post("/cart/add",cartController.add)
route.post("/cart/getall",cartController.getall)
route.post("/cart/getsingle",cartController.getsingle)
route.post("/cart/updateStatus",cartController.updateStatus)
route.post("/cart/pay",cartController.pay)
route.post("/cart/verifypayment",cartController.verifyPayment)
//review

route.post("/review/add",reviewController.add)
route.post("/review/getall",reviewController.getall)

//query
route.post("/query/add",queryController.add)
route.post("/query/getall",queryController.getall)

route.post("/toggle-wishlist", wishlistController.toggleWishlist);
route.post("/get-wishlist", wishlistController.getWishlist);

module.exports = route;
