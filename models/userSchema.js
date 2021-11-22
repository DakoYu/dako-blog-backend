const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user must have a name']
    },
    email: {
        type: String,
        required: [true, 'user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'user must have password'],
        minlength: 8,
        select: false
    },
    confirmedPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            }, 
            message: 'Passwords are not the same'
        }
    },
    photo: {
        type: String,
        default: 'default.png'
    },
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmedPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(clientPassword, storedPassword) {
    return await bcrypt.compare(clientPassword, storedPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;