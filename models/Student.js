const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson',
    }],
});

const Student = mongoose.model('student', StudentSchema);
module.exports = Student;