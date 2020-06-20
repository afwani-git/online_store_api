const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sessions = require("express-session");
const passport = require("passport");
const xssFilter = require("x-xss-protection");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const router = require("./app/routers");

const app = express();
// middleware //
//passport, session, cookie
const sess = {
	secret: process.env.sessionSecret,
	key: process.env.key,
	resave: false,
	saveUninitialized: false
};

//cors
app.use(cors());

app.use(cookieParser());
app.use(sessions(sess));
app.use(passport.initialize());
app.use(passport.session());

//loger
if (process.env.NODE_ENV === "development") {
	app.use(logger("dev"));
	console.log("logger on");
}

//xss and header protect
app.use(xssFilter());
app.use(helmet());

//helpers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//services
require("./services/mongoose");
require("./services/passport");

//route
app.use("/api/v1/", router);

module.exports = app;
