const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderProductsSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'order' },
    product_id: [Schema.Types.ObjectId],
});



module.exports = OrderProducts = mongoose.model("order_products", OrderProductsSchema);