const mongoose = require("mongoose");
const validator = require('validator');

const User = mongoose.model("User", {
    email: {
        type: String,
        trim: true,
        require: true,
        minlength: 1,
        unique: true,
        validate:  validator.isEmail,
        message: "{VALUE} is not a valid email"
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = {User};
