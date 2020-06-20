const Users = require("../models/User");

exports.isUser = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.status(401).json({
			status: 401,
			data: {
				isAuth: false
			}
		});
	}
};

exports.isAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user.isAdmin) {
		return next();
	} else {
		res.status(401).json({
			status: 401,
			data: {
				isAuth: false
			}
		});
	}
};
