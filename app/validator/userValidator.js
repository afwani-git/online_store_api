const { check, body } = require("express-validator");
const User = require("../models/User");

exports.register = [
	check("username", "You must supply a name!").notEmpty(),
	check("email", "That Email is not valid!").isEmail(),
	check("password", "Password Cannot  be Blank!").notEmpty(),
	body("passwordConfirmation").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		return true;
	}),
	body("email").custom(value => {
		return User.findOne({ email: value }).then(user => {
			if (user) {
				return Promise.reject("E-mail already in use");
			}
		});
	})
];

exports.resetPassword = [
	body("passwordConfirmation").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		return true;
	})
];
