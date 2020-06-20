const User = require("../models/User");
const Product = require("../models/Product");

exports.index = async (req, res) => {
	const user = req.user;

	const selfUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
	const cartUrl = req.protocol + "://" + req.get("host") + "/user/cart";
	const favoriteProdUrl =
		req.protocol + "://" + req.get("host") + "/user/myfavorite";

	links = {
		self: selfUrl,
		cart: cartUrl,
		favorite: favoriteProdUrl
	};

	res.json({
		status: 200,
		data: {
			isAuth: true,
			user,
			links
		}
	});
};

exports.getFavoriteProd = async (req, res) => {
	const favorite = await User.getFavoriteProd(req.user._id);

	res.json({
		status: 200,
		data: {
			favorite
		}
	});
};

exports.getCart = async (req, res) => {
	const userCart = await User.getCart(req.user._id);

	res.json({
		status: 200,
		data: userCart
	});
};
