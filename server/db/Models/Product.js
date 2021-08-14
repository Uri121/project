const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

ProductSchema.virtual('id').get(function () { return this._id; });


module.exports = Product = mongoose.model("product", ProductSchema);