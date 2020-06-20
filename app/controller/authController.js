const passport = require("passport");
const User = require("../models/User");
const MailerService = require("../../services/mailer");
const { validationResult } = require("express-validator");

exports.register = async (req, res, next) => {
	const { username, email, password } = req.body;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: 400,
			data: {
				userCreated: false,
				errors: errors.array()
			}
		});
	}

	const newUser = await new User({ username, email });
	await User.register(newUser, password);

	res.json({
		status: 200,
		data: {
			userCreated: true,
			message: "register success"
		}
	});
};

exports.login = passport.authenticate("local", {
	failureRedirect: "/api/v1/user",
	successRedirect: "/api/v1/user"
});

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	const token = await User.createToken(email);

	MailerService.sendMail(req, email, token);

	res.json({
		status: 200,
		data: {
			message: "reset mail send"
		}
	});
};

exports.checkToken = async (req, res) => {
	const validToken = await User.findOne({
		tokenPass: req.params.token
	});
	if (!validToken)
		return res.json({
			status: 403,
			data: {
				messages: "invalid token!!"
			}
		});

	return res.json({
		status: 200,
		data: {
			messages: "token valid!!"
		}
	});
};

exports.resetPassword = async (req, res) => {
	const { password } = req.body;
	const user = await User.findOne({ tokenPass: req.params.token });
	const errors = validationResult(req);

	if (!user) {
		return res.json({
			status: 403,
			data: {
				message: "invalid token!!"
			}
		});
	}

	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: 400,
			data: {
				userCreated: false,
				errors: errors.array()
			}
		});
	}

	user.setPassword(password, async (err, pass) => {
		try {
			pass.tokenPass = "";
			await pass.save();
		} catch (err) {
			console.log(err);
		}
	});

	res.json({
		status: 200,
		data: {
			message: "reset password success"
		}
	});
};
