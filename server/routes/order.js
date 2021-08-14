const express = require("express");
const router = express.Router();
const { createNewOrder, getOrders, updateOrderStatus } = require('../handlers/orderHandler');

// create order
router.put('/create', createNewOrder)
//get list of all products
router.get('/', getOrders)
//update order status
router.post('/:orderId/:status', updateOrderStatus);


module.exports = router;