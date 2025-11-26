const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const EventLog = require('../models/EventLog');

// Log an event (Authenticated users only)
router.post('/log', authMiddleware, async (req, res) => {
    try {
        const { event, page, details } = req.body;

        const userModelMap = {
            admin: 'Admin',
            gym: 'Gym',
            trainer: 'Trainer',
            member: 'Member',
        };

        const eventLog = new EventLog({
            event: event || 'Page View',
            page: page || 'N/A',
            user: req.user.id,
            userModel: userModelMap[req.user.role],
            details: details || `${userModelMap[req.user.role]} visited ${page}`,
        });

        await eventLog.save();
        res.status(201).json({ message: 'Event logged' });
    } catch (error) {
        console.error('Error logging event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
