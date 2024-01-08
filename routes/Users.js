const ValidUser = require('../middlewares/Authenticator');
const ValidRequest = require('../middlewares/Validator');
const Otp = require('../models/Otp');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/Users');
const { Register, Login, SendOtp, PasswordChange } = require('../validators/UserValidator');
const router = require('express').Router();
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');

const sendMail = async (email, message) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.user,
        to: email,
        subject: 'Tutor App Mail Service System',
        html: message
    }

    await new Promise((resolve, reject) => {
        transport.sendMail(options, (err, info) => {
            if (err) {
                reject(err);
                console.log(err.message);
            } else {
                console.log('Emailed successfully!');
                resolve(info);
            }
        });
    });
}

router.post('/register', ValidRequest(Register), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ success: false, message: 'User already exists' });

        user = await User.create(req.body);
        if (req.body.role === "teacher")
            await Teacher.create({ user: user._id });

        else if (req.body.role === "student")
            await Student.create({ user: user._id });

        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post("/login", ValidRequest(Login), async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (!user || !await user.validatePassword(req.body.password))
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });

        if (user?.role !== req.body.role)
            return res.status(400).json({ success: false, message: "Role not applicable as registered" })

        user = await User.findOne({ email: req.body.email }).select("-password");
        const token = await user.generateToken();
        console.log(token);
        res.status(200).json({ success: true, user: { user, token } });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateUser/:id', ValidUser, async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const newUser = {};
        if (name) newUser.name = name;
        if (email) newUser.email = email;
        if (avatar) newUser.avatar = avatar;

        const user = await User.findByIdAndUpdate(req.params.id, newUser, { new: true });
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/getAllUsers', ValidUser, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/sendOtp', ValidRequest(SendOtp), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: 'User not fetched' });

        const otp = await Otp.create({
            email,
            otp: Math.floor(Math.random() * 9000) + 1000, // this will generate 4 digit otp
            expiresIn: new Date().getTime() * 5 * 60 * 1000,
        });

        sendMail(email, `<h4>Your one time password for updation of your password is ${otp.otp}. It is valid for only 5 mins. Please do not share it with anyone. <br /> Thank You!</h4>`);

        res.json({ success: true, otp });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/changePassword', ValidRequest(PasswordChange), async (req, res) => {
    try {
        const { otp, email, password } = req.body;
        console.log(req.body);
        const validOtp = await Otp.findOne({ email, otp });

        if (validOtp) {
            const diff = validOtp.expiresIn - new Date().getTime();
            if (diff < 0)
                return res.status(400).json({ success: false, message: "OTP expired" });

            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(password, salt);

            const user = await User.findOneAndUpdate({ email }, { password: secPass }, { new: true });

            sendMail(email, "<h4>Your password for the Tutor App has been updated. Please login and verify. If it wasn't you then please contact us immediately. Thank you</h4>");

            res.status(200).json({ success: true, user });

        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' })
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

module.exports = router;