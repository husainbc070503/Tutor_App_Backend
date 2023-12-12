const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    avatar: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    },

    role: {
        type: String,
        default: 'student',
        enum: ['student', 'teacher', 'admin']
    },

}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password'))
            return next();

        const salt = await bcryptjs.genSalt();
        const secPassword = await bcryptjs.hash(user.password, salt);
        user.password = secPassword;
    } catch (error) {
        next(error.message);
    }
});

UserSchema.methods.validatePassword = async function (password) {
    try {
        const res = await bcryptjs.compare(password, this.password);
        return res;
    } catch (error) {
        console.log(error.message);
    }
}

UserSchema.methods.generateToken = async function () {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        return jwt.sign({
            userId: this._id.toString(),
        }, JWT_SECRET, { expiresIn: '10d' });
    } catch (error) {
        console.log(error.message);
    }
}

const User = mongoose.model('user', UserSchema);
module.exports = User;