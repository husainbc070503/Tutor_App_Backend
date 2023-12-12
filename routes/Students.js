const ValidUser = require('../middlewares/Authenticator');
const isAdmin = require('../middlewares/IsAdmin');
const isStudent = require('../middlewares/isStudent');
const Student = require('../models/Student');
const router = require('express').Router();

/* Get all students by admin */
router.get('/allStudents', ValidUser, isAdmin, async (req, res) => {
    try {
        const students = await Student.find().populate('user', ['name', 'email', 'avatar']);
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Get student profile */
router.get('/student', ValidUser, isStudent, async (req, res) => {
    try {
        const student = await Student.find({ user: req.user._id })
            .populate(['lessons', 'lessons.teacher'])
            .populate('user');

        res.status(200).json({ success: true, student });

    } catch (error) {
        res.status(200).json({ success: true, message: error.message });
    }
});

module.exports = router;