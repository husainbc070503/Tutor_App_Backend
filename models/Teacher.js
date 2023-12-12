const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    lesson: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
    }],
});

const Teacher = mongoose.model('teacher', TeacherSchema);
module.exports = Teacher;