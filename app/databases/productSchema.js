const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: "none"
	},
	image: {
		type: String,
		default: "https://dummyimage.com/400x400/050505/f4f5fc.gif&text=no+pic"
	},
	qty: {
		type: Number,
		default: 1
	},
	price: {
		type: Number,
		default: 0
	},
	category: {
		type: Array,
		required: true
	}
});

productSchema.index({ name: "text", description: "text" });

module.exports = productSchema;
