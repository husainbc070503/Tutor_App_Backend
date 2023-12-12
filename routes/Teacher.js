const ValidUser = require('../middlewares/Authenticator');
const isAdmin = require('../middlewares/IsAdmin');
const isTeacher = require('../middlewares/isTeacher');
const Teacher = require('../models/Teacher');
const router = require('express').Router();

/* Get all teacher only by admin */
router.get('/allTeachers', ValidUser, isAdmin, async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('user', ['name', 'email', 'avatar']);
        res.status(200).json({ success: true, teachers });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Get teacher profile */
router.get('/teacher', ValidUser, isTeacher, async (req, res) => {
    try {
        const teacher = await Teacher.find({ user: req.user._id })
            .populate('user', ['name', 'email', 'avatar'])
            .populate('lesson');

        res.status(200).json({ success: true, teacher });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;