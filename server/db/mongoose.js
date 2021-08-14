const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' });
const MODE = process.env.NODE_ENV
const uri = MODE === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI
const connectMongoose = async () => {
    try {
        const conn = await mongoose.connect(
            uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }
        );
        console.log(`🍃 MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`🔴 ${error}`);
        process.exit(1);
    }
};

module.exports = connectMongoose;