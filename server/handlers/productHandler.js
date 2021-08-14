const User = require("../db/Models/User");
const Product = require("../db/Models/Product");
const jwt = require("jsonwebtoken");
const { handleRes, handleError } = require('./utils');

const createNewProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);
        const user = await User.findById(decodedData.id);
        if (!user) {
            throw new Error('User does not exist')
        }
        if (user.role !== 'admin') {
            throw new Error('User does not have the right role to add product')
        }

        const product = new Product({
            name,
            price
        });

        const productRes = await product.save();
        if (productRes) {
            const jsonRes = handleRes(productRes);
            res.send(jsonRes)
        } else {
            throw new Error('failed to save the product')
        }
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError)
    }
}

const getProducts = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);
        const user = await User.findById(decodedData.id);
        if (!user) {
            throw new Error('User does not exist')
        }

        const productRes = await Product.find({}, { name: 1, price: 1, _id: 1 })
        if (productRes) {
            const jsonRes = handleRes(productRes);
            res.send(jsonRes)
        } else {
            throw new Error('failed to fetch the products')
        }
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError)
    }
}

exports.createNewProduct = createNewProduct;
exports.getProducts = getProducts;