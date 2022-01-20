const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    avatarUrl: {
        type: String,
    },

    // Google Account
    googleId: {
        type: String,
    },

    // Local Account
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);
