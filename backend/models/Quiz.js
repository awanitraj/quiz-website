const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    timeLimit: { type: Number }, // in minutes
    isPublished: { type: Boolean, default: false }
});

module.exports = mongoose.model('Quiz', QuizSchema);