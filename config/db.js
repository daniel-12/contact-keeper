const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = () => {
    mongoose.connect(db)
};

module.exports = connectDB;