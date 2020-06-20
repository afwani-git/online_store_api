const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.index = async (req, res) => {
	let { limit, page, sort, criteria, field, search } = req.query;

	field = field ? field.split(",").join(" ") : field;
	sort = sort ? sort : "name";
	criteria = criteria == "desc" ? -1 : 1;
	search = search ? search : "";

	const result = await Product.find(
		{
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } }
			]
		},
		field
	)
		.pagination(parseInt(limit), parseInt(page))
		.sort({ [sort]: [criteria] });

	res.status(200).json({
		status: 200,
		data: result
	});
};

exports.getCurrentProd = async (req, res) => {
	const { idProduct } = req.params;

	const { product, reviews } = await Product.getCurrentProd(idProduct);

	res.json({
		status: 200,
		data: {
			product,
			reviews
		}
	});
};

exports.deleteProduct = async (req, res) => {
	const { idProduct } = req.params;
	await Product.deleteOne({ _id: mongoose.Types.ObjectId(idProduct) });
	res.status(204).json({});
};

exports.editProduct = async (req, res) => {
	const { idProduct } = req.params;
	const { name, description, qty, price, image } = req.body;

	const result = await Product.updateOne(
		{
			_id: mongoose.Types.ObjectId(idProduct)
		},
		req.body
	);

	res.status(200).json({
		status: 200,
		data: result
	});
};

exports.addProduct = async (req, res) => {
	const { name, description, qty, price, image } = req.body;

	const newProduct = new Product(req.body);

	const result = await newProduct.save();

	res.status(201).json({
		status: 201,
		data: result
	});
};

exports.favProduct = async (req, res) => {
	const { idProduct } = req.params;
	const favMaps = req.user.favorite.map(obj => obj.toString());
	const operator = favMaps.includes(idProduct) ? "$pull" : "$push";

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			[operator]: { favorite: mongoose.Types.ObjectId(idProduct) }
		},
		{
			new: true
		}
	);

	res.status(200).json({
		status: 200,
		data: user
	});
};

exports.addToCart = async (req, res) => {
	const { idProduct } = req.params;
	const { action } = req.query;

	switch (action) {
		case "add":
			await User.addToCart(idProduct, req.user);
			break;
		case "remove":
			await User.removeItemTocart(idProduct, req.user);
			break;
		default:
			await User.addToCart(idProduct, req.user);
	}

	res.json({
		status: 200,
		data: {
			message: "cart has modiefed"
		}
	});
};
