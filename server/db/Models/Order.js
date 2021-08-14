const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
    status: {
        type: String,
        enum: ['received', 'in_progress', 'done'],
        default: 'in_progress'
    }
});

OrderSchema.virtual('order_id').get(function () { return this._id; });

module.exports = Order = mongoose.model("order", OrderSchema);