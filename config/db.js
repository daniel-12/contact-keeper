const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');  // We need a mongoURI Json string to have access to mongo DB.

const connectDB = async () => {
    try {
        // Using mongoose to connect to our mongo db string, other fields are boilerplate necessary.
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;