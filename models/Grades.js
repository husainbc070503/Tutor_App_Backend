const mongoose = require('mongoose');

const GradesSchema = new mongoose.Schema({
    grade: {
        type: Number,
        min: 0, max: 10,
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
    },  

}, { timestamps: true });

const Grades = mongoose.model('grade', GradesSchema);
module.exports = Grades;