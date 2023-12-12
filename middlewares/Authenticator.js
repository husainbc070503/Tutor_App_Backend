const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const secret = process.env.JWT_SECRET;

const ValidUser = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const data = jwt.verify(token, secret);
            req.user = await User.findById(data.userId).select('-password');
            next();
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    } else {
        res.status(400).json({ success: false, message: 'Unauthenticated user' });
    }
}

module.exports = ValidUser;