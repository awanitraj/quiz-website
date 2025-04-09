const express = require('express');
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Middleware to check admin role
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
    }
    next();
};

// Get all quizzes (including unpublished)
router.get('/quizzes', auth, adminCheck, async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Publish/unpublish quiz
router.put('/quiz/:id/publish', auth, adminCheck, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

        quiz.isPublished = req.body.publish;
        await quiz.save();
        
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;