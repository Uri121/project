const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");
const User = require("../db/Models/User");
const { handleRes, handleError } = require('./utils');
const Order = require('../db/Models/Order');
const Product = require('../db/Models/Product');

dotenv.config({ path: '../config/config.env' });


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


const authUser = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);
        const user = await User.findById(decodedData.id);
        const jsonRes = handleRes(user);
        res.send(jsonRes);
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError);
    }

}

const createUser = async (req, res) => {
    try {
        let { fullName, email, password, role } = req.body;
        let userMail = await User.findOne({ email: email });
        if (userMail) {
            throw new Error('A user with that email is already exist.')
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({
            full_name: fullName,
            email,
            password: hashedPassword,
            role
        });


        user.save().then(user => {
            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" },
                (err, token) => {
                    if (err) throw new Error(err);
                    // res.json({ token, user });
                    const jsonRes = handleRes({ token, user })
                    res.send(jsonRes);
                }
            );
        });
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError);
    }
}

const userLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userFromDatabase = await User.findOne({ email: email });

        if (!userFromDatabase) {
            throw new Error('User not exist in the system please register first')
        }
        const validPassword = await validatePassword(password, userFromDatabase.password);
        if (!validPassword) {
            throw new Error('Wrong password')
        }

        const user = userFromDatabase
        jwt.sign(
            { id: userFromDatabase._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) throw new Error(error);
                const jsonRes = handleRes({ token, user })
                res.send(jsonRes);
            }
        );
    } catch (error) {
        const jsonError = handleError(this.name, error);
        res.send(jsonError);
    }
}

const getUserFilterList = async (req, res) => {
    try {
        const { list, value } = req.params
        const token = req.header("x-auth-token");
        const decodedData = await jwt.decode(token);
        const user = await User.findById(decodedData.id);
        let mongoRes;

        if (user.role === 'admin') {
            mongoRes = list === 'orders' ? await Order.find({}, { date: 1, user_id: 1, status: 1, _id: 1 }).lean() : await Product.find({}, { name: 1, price: 1, _id: 1 }).lean()
        } else {
            mongoRes = await Order.find({ user_id: user._id }, { date: 1, user_id: 1, status: 1, _id: 1 }).lean()
        }
        //filter on all the object properties and find if filter value includes
        const filtered = value !== 'empty' ? mongoRes.filter(item => Object.values(item).find(val => val.toString().includes(value))) : mongoRes

        const jsonRes = handleRes(filtered)
        res.send(jsonRes)

    } catch (error) {
        console.log("error in getUserFilterList:", error);
        const jsonError = handleError(this.name, error)
        res.send(jsonError)
    }


}


exports.authUser = authUser;
exports.createUser = createUser;
exports.userLogin = userLogin;
exports.getUserFilterList = getUserFilterList;