const userSchema = require("../databases/userSchema");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const cryptoRandomString = require("crypto-random-string");

class userClass {
	static getFavoriteProd(id) {
		return this.findOne({ _id: id }, "favorite").populate("favorite");
	}

	static async getCart(id) {
		const { cart } = await this.findOne({ _id: id }, "cart");

		const totalItem = cart.reduce((acc, obj) => acc + parseInt(obj.qty), 0);
		const totalCost = cart.reduce((acc, obj) => acc + parseInt(obj.price), 0);

		return {
			cart,
			totalCost,
			totalItem
		};
	}

	static async removeItemTocart(idProduct, user) {
		idProduct = mongoose.Types.ObjectId(idProduct);

		//cari produk
		const curProd = await Product.findOne({ _id: idProduct });

		user.cart.map(prod => {
			if (prod._id == idProduct.toString()) {
				//kurangi qty + hitung ulang
				prod.qty--;
				const total = prod.qty * curProd.price;
				prod.price = total;
			}
		});

		const newCart = user.cart.filter(prod => {
			return parseInt(prod.qty) != 0;
		});

		await this.updateOne(
			{ _id: mongoose.Types.ObjectId(user._id) },
			{
				$set: {
					cart: newCart
				}
			}
		);

		return true;
	}

	static async addToCart(idProduct, user) {
		idProduct = mongoose.Types.ObjectId(idProduct);
		const { _id, name, price } = await Product.findOne({ _id: idProduct });
		const product = {
			_id,
			name,
			qty: 1,
			price
		};

		if (!user.cart.length) {
			user.cart.push(product);
		} else {
			if (!user.cart.filter(prod => prod._id == idProduct.toString()).length) {
				user.cart.push(product);
			} else {
				const curProd = await Product.findOne({ _id: idProduct });
				user.cart.map(prod => {
					if (prod._id.toString() == idProduct.toString()) {
						prod.qty++;
						let total = curProd.price * prod.qty;
						prod.price = total;
					}
				});
			}
		}

		await this.updateOne(
			{ _id: mongoose.Types.ObjectId(user._id) },
			{
				$set: {
					cart: user.cart
				}
			}
		);

		return true;
	}

	static async createToken(email) {
		const hashToken = cryptoRandomString({ length: 32 });

		await this.updateOne(
			{
				email: email
			},
			{
				tokenPass: hashToken
			}
		);

		return hashToken;
	}
}

userSchema.loadClass(userClass);

module.exports = mongoose.model("Users", userSchema);
