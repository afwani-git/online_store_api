const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "Users"
	},
	productId: {
		type: mongoose.Types.ObjectId,
		ref: "Products"
	},
	comment: {
		type: String,
		required: true
	},
	reply: [
		{
			type: mongoose.Types.ObjectId,
			ref: "Reviews"
		}
	],
	isReplyType: {
		type: Boolean,
		default: false
	}
});

module.exports = reviewSchema;
