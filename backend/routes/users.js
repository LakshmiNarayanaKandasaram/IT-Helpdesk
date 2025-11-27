const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get IT staff list (for assignment dropdown)
router.get('/it-staff', authenticateToken, authorizeRole('team_lead'), async (req, res) => {
    try {
        const itStaff = await User.getAllITStaff();
        res.json(itStaff);
    } catch (error) {
        console.error('Error fetching IT staff:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
