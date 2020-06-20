const express = require("express");
const app = express();
const router = express.Router();
const auth = require("./middleware/auth");
const userValidator = require("./validator/userValidator");
const productValidator = require("./validator/productValidator");
const userController = require("./controller/userController");
const productController = require("./controller/productController");
const authController = require("./controller/authController");
const reviewsController = require("./controller/reviewsController");

//user
router.get("/user", auth.isUser, userController.index);
router.get("/user/favorite", auth.isUser, userController.getFavoriteProd);
router.get("/user/cart", auth.isUser, userController.getCart);

//auth
router.post("/user/login", authController.login);
router.post("/user/register", userValidator.register, authController.register);
router.post("/user/forgot", authController.forgotPassword);
router.get("/user/reset/:token", authController.checkToken);
router.post(
	"/user/reset/:token",
	userValidator.resetPassword,
	authController.resetPassword
);

//product
router.post(
	"/product/add",
	productValidator.checkBody,
	auth.isAdmin,
	productController.addProduct
);
router.get("/products", productController.index);
router.get(
	"/product/delete/:idProduct",
	auth.isAdmin,
	productController.deleteProduct
);
router.post(
	"/product/edit/:idProduct",
	productValidator.checkBody,
	auth.isAdmin,
	productController.editProduct
);
router.get(
	"/product/favorite/:idProduct",
	auth.isUser,
	productController.favProduct
);
router.get(
	"/product/cart/:idProduct",
	auth.isUser,
	productController.addToCart
);
router.get("/product/:idProduct", productController.getCurrentProd);

//reviews
router.post(
	"/product/:idProduct/post",
	auth.isUser,
	reviewsController.postReview
);
router.post(
	"/product/:productId/post/:reviewsId/reply",
	auth.isUser,
	reviewsController.replyPost
);

//handle 404
router.all("*", function(req, res) {
	res.status(404).json({
		status: 404,
		data: {
			message: "not found"
		}
	});
});

module.exports = router;
