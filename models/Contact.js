const mongoose = require('mongoose');

// UserSchema is like a component; a template.

const ContactSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Both type and ref are just a number, an ID.
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
        phone: {
        type: String,
    },
    type: {
        type: String,
        default: 'personal'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('contact', ContactSchema);