const productSchema = require("../databases/productSchema");
const mongoose = require("mongoose");
const Reviews = require("../models/Reviews");

class productClass {
	static async getCurrentProd(id) {
		id = mongoose.Types.ObjectId(id);

		const product = await this.findOne({ _id: id });

		const reviews = await Reviews.find(
			{ $and: [{ productId: id }, { isReplyType: false }] },
			"userId comment reply"
		).deepPopulate(
			"reply.userId userId",
			"reply.userId.username userId.username"
		);

		return {
			product,
			reviews
		};
	}
}

productSchema.query.pagination = function(limit = 0, page = 0) {
	return this.limit(limit).skip(page * limit);
};

productSchema.loadClass(productClass);

module.exports = mongoose.model("Products", productSchema);
