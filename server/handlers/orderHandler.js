
const mongoose = require('mongoose');
const User = require("../db/Models/User");
const Order = require("../db/Models/Order");
const Order_Products = require("../db/Models/Order_Products");
const jwt = require("jsonwebtoken");
const { handleRes, handleError } = require('./utils');

const createNewOrder = async (req, res) => {
    try {
        const { userId, products_ids } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User does not exist')
        }
        const order = new Order({
            date: new Date(),
            user_id: userId,
        });

        const orderRes = await order.save();


        const orderProduct = new Order_Products({
            order_id: orderRes._id,
            product_id: products_ids
        })

        const orderProductsRes = await orderProduct.save();
        if (orderRes && orderProductsRes) {
            const jsonRes = handleRes(orderRes);
            res.send(jsonRes);
        } else {
            throw new Error('failed to save the order')
        }
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError);
    }
}

const getOrders = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);

        const user = await User.findById(decodedData.id);
        if (!user) {
            throw new Error('User does not exist')
        }

        const orderRes = user.role === 'admin' ? await Order.find({}, { date: 1, user_id: 1, status: 1, _id: 1 }) : await Order.find({ user_id: user._id }, { date: 1, user_id: 1, status: 1, _id: 1 });

        if (orderRes) {
            const jsonRes = handleRes(orderRes);
            res.send(jsonRes)
        } else {
            throw new Error('failed to fetch the orders')
        }
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError)
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.params
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);
        const user = await User.findById(decodedData.id);
        if (!user) {
            throw new Error('User does not exist')
        }

        if (user.role !== 'admin') {
            throw new Error('only admins can change order status')
        }

        const query = { _id: orderId };
        const update = {
            "$set": {
                "status": status,
            }
        }
        const options = { returnNewDocument: true };
        const updateOrder = await Order.findOneAndUpdate(query, update, options);
        if (updateOrder) {
            const orderRes = user.role === 'admin' ? await Order.find({}, { date: 1, user_id: 1, status: 1, _id: 1 }) : await Order.findById(user.id, { date: 1, user_id: 1, status: 1, _id: 1 });
            const jsonRes = handleRes(orderRes);
            res.send(jsonRes)
        } else {
            throw new Error('failed to fetch the orders')
        }
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError)
    }
}

exports.createNewOrder = createNewOrder
exports.getOrders = getOrders
exports.updateOrderStatus = updateOrderStatus