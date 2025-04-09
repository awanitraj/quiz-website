const express = require('express');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const router = express.Router();

// Get questions for a quiz
router.get('/:quizId', async (req, res) => {
    try {
        const questions = await Question.find({ quizId: req.params.quizId });
        res.json(questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add question (admin only)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { quizId, questionText, options, correctAnswer, points } = req.body;
        
        const newQuestion = new Question({
            quizId,
            questionText,
            options,
            correctAnswer,
            points
        });

        const question = await newQuestion.save();
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;