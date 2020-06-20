const mongoose = require("mongoose");

mongoose.connect(
	"mongodb://localhost/db_toko",
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
	function(err) {
		if (err) {
			console.log(
				"Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!"
			);
		} else {
			console.log("db connected");
		}
	}
);
mongoose.set("useCreateIndex", true);
