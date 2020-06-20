const { check, body } = require("express-validator");
const User = require("../models/User");

exports.checkBody = [check("name").notEmpty()];
