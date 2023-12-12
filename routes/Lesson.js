const ValidUser = require('../middlewares/Authenticator');
const isAdmin = require('../middlewares/IsAdmin');
const Lesson = require('../models/Lessons');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const router = require('express').Router();

/* Add lesson */
router.post('/addLesson', ValidUser, isAdmin, async (req, res) => {
    try {
        const { subject, chapter, title, teacher, students } = req.body;
        var lesson = await Lesson.create({ subject, chapter, title, teacher, students });
        lesson = await Lesson.findById(lesson._id).populate('teacher').populate(['students']);

        /* Updating Teacher */
        await Teacher.findOneAndUpdate({ user: teacher }, { $push: { lesson: lesson._id } }, { new: true });

        /* Updating Students */
        students.forEach(async (student) => {
            await Student.findOneAndUpdate({ user: student }, { $push: { lessons: lesson._id } });
        });

        res.status(200).json({ success: true, lesson });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Update lesson */
router.put('/updateLesson/:id', ValidUser, isAdmin, async (req, res) => {
    try {
        var lesson = await Lesson.findById(req.params.id);
        await Teacher.findOneAndUpdate({ user: lesson.teacher }, { $pull: { lesson: lesson._id } }, { new: true });

        lesson = await Lesson.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('teacher').populate('students');
        await Teacher.findOneAndUpdate({ user: req.body.teacher }, { lesson: lesson._id }, { new: true });

        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Delete lesson */
router.delete('/deleteLesson/:id', ValidUser, isAdmin, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        await Teacher.findOneAndUpdate({ user: lesson.teacher }, { $pull: { lesson: lesson._id } }, { new: true });

        lesson.students.forEach(async (student) => {
            await Student.findOneAndUpdate({ user: student }, { $pull: { lessons: lesson._id } }, { new: true });
        });

        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Get all lessons */
router.get('/allLessons', ValidUser, async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('teacher').populate('students');
        res.status(200).json({ success: true, lessons });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Add more students */
router.put('/addStudents/:id', ValidUser, isAdmin, async (req, res) => {
    try {
        const { students } = req.body;
        students.map(async (student) => {
            const lesson = await Lesson.findByIdAndUpdate(req.params.id, { $push: { students: student } }, { new: true }).populate('teacher').populate('students');
            await Student.findOneAndUpdate({ user: student }, { $push: { lessons: lesson._id } }, { new: true });
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

/* Remove students */
router.put('/removeStudent/:id', ValidUser, isAdmin, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, { $pull: { students: req.body.student } }, { new: true }).populate('teacher').populate('students');
        await Student.findOneAndUpdate({ user: req.body.student }, { $pull: { lessons: lesson._id } }, { new: true });
        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;