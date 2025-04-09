const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    points: { type: Number, default: 1 },
    questionType: { type: String, enum: ['mcq', 'truefalse'], default: 'mcq' }
});

module.exports = mongoose.model('Question', QuestionSchema);