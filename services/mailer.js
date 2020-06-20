require("dotenv").config();
const nodemailer = require("nodemailer");

exports.sendMail = async function(req, userMail, token) {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.hostSMTP,
			port: process.env.portSMTP,
			auth: {
				user: process.env.mailUser,
				pass: process.env.mailPass
			}
		});

		const resetURL =
			req.protocol + "://" + req.get("host") + "/api/v1/user/reset/" + token;

		const msg = {
			from: process.env.mail,
			to: userMail,
			subject: "reset password",
			text: `click  here to reset password => ${resetURL}`,
			html: `click <a href="${resetURL}">here</a> to reset password`
		};

		const info = await transporter.sendMail(msg);
		console.log(info);
	} catch (err) {
		console.log(err);
	}
};
