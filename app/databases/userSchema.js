const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	location: {
		type: {
			type: String
		},
		coordinates: {
			type: Array,
			default: []
		}
	},
	favorite: [
		{
			type: Schema.Types.ObjectId,
			ref: "Products"
		}
	],
	cart: [
		{
			_id: mongoose.Types.ObjectId,
			name: String,
			qty: String,
			price: String
		}
	],
	history: {
		type: Array,
		default: []
	},
	order: {
		type: Array,
		default: []
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	tokenPass: {
		type: String,
		default: ""
	}
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = userSchema;
