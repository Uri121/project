const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: [/\S+@\S+\.\S+/, "is invalid"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    }
});

UserSchema.virtual('id').get(function () { return this._id; });

module.exports = User = mongoose.model("user", UserSchema);