const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        darkMode: { type: Boolean, default: false },
        emailNotifications: { type: Boolean, default: true },
        twoFactorAuth: { type: Boolean, default: false },
        language: { type: String, default: 'English' }
    }
});

module.exports = mongoose.model('user', UserSchema);
