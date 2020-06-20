const reviewSchema = require("../databases/reviewsSchema");
const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);

class reviewClass {
	async post(reviewsId) {
		await this.model("Reviews").updateOne(
			{
				_id: mongoose.Types.ObjectId(reviewsId)
			},
			{
				$push: {
					reply: mongoose.Types.ObjectId(this._id)
				}
			}
		);
	}
}

reviewSchema.loadClass(reviewClass);
reviewSchema.plugin(deepPopulate);
module.exports = mongoose.model("Reviews", reviewSchema);
