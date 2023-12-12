const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },

    chapter: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],

}, { timestamps: true });

const Lesson = mongoose.model('lesson', LessonSchema);
module.exports = Lesson;