const express = require('express');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublished: true });
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Admin routes (protected)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { title, description, timeLimit } = req.body;
        const newQuiz = new Quiz({
            title,
            description,
            timeLimit,
            createdBy: req.user.id
        });

        const quiz = await newQuiz.save();
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;