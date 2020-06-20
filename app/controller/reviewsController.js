const Reviews = require("../models/Reviews");

exports.postReview = async (req, res) => {
	const userId = req.user._id;
	const productId = req.params.idProduct;
	const { comment } = req.body;

	const newReview = new Reviews({
		userId,
		productId,
		comment
	});

	await newReview.save();

	res.redirect(`/api/v1/product/${productId}`);
};

exports.replyPost = async (req, res) => {
	const { productId, reviewsId } = req.params;
	const { comment } = req.body;
	const userId = req.user._id;

	const newReply = new Reviews({
		userId,
		productId,
		comment
	});

	newReply.post(reviewsId);
	newReply.isReplyType = true;
	newReply.save();

	res.redirect(`/api/v1/product/${productId}`);
};
