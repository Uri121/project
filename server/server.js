const express = require('express')
const path = require('express')
const dotenv = require('dotenv')
const connectMongoose = require('./db/mongoose');
const user = require("./routes/user");
const product = require("./routes/product");
const order = require("./routes/order");
const auth = require("./middleware/auth");

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 4000;
const app = express()

app.use(express.urlencoded());
app.use(express.json());

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}



app.listen(PORT, async () => {
    try {
        await connectMongoose()
        console.log(`the app is running on port: ${PORT} in ${process.env.NODE_ENV} mode.`)
    } catch (error) {
        console.log('Server Error', error.message)
    }
})

//Use Routes
app.use("/user", user);
app.use("/product", auth, product);
app.use("/order", auth, order);