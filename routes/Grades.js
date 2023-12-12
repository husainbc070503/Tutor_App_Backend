const ValidUser = require('../middlewares/Authenticator');
const isStudent = require('../middlewares/isStudent');
const isTeacher = require('../middlewares/isTeacher');
const Grades = require('../models/Grades');
const router = require('express').Router();

/* Add Grading */
router.post('/addGrade', ValidUser, isTeacher, async (req, res) => {
    try {
        const { grade, teacher, lesson, student } = req.body;

        var grading = await Grades.create({ grade, teacher, lesson, student });
        grading = await Grades.findById(grading._id)
            .populate('teacher')
            .populate('lesson')
            .populate('student');

        res.status(200).json({ success: true, grading });

    } catch (error) {
        res.status(400).json({ success: true, message: error.message });
    }
});

/* Update Grading */
router.put('/updateGrading/:id', ValidUser, isTeacher, async (req, res) => {
    try {
        const grading = await Grades.findByIdAndUpdate(req.params.id, { grade: req.body.grade }, { new: true })
            .populate('teacher')
            .populate('lesson')
            .populate('student');

        res.status(200).json({ success: true, grading });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Get all gradings */
router.get('/allGradings', ValidUser, async (req, res) => {
    try {
        const grades = await Grades.find().populate('teacher')
            .populate('lesson')
            .populate('student')
        res.status(200).json({ success: true, grades });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;