const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all tickets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tickets = await Ticket.findAll(req.user.id, req.user.role);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single ticket
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const comments = await Ticket.getComments(req.params.id);
        res.json({ ...ticket, comments });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create ticket
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Title, description, and category are required' });
        }

        const ticketId = await Ticket.create({
            title,
            description,
            category,
            priority,
            created_by: req.user.id
        });

        res.status(201).json({ 
            message: 'Ticket created successfully', 
            ticketId 
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Assign ticket (Team Lead only)
router.put('/:id/assign', authenticateToken, authorizeRole('team_lead'), async (req, res) => {
    try {
        const { assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({ error: 'Assignee ID required' });
        }

        const success = await Ticket.assignTicket(
            req.params.id,
            assigned_to,
            req.user.id
        );

        if (!success) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json({ message: 'Ticket assigned successfully' });
    } catch (error) {
        console.error('Error assigning ticket:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update ticket status
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status, resolution_notes } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        // Check if user is authorized to update this ticket
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // IT staff can only update tickets assigned to them
        if (req.user.role === 'it_staff' && ticket.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this ticket' });
        }

        const success = await Ticket.updateStatus(
            req.params.id,
            status,
            resolution_notes
        );

        if (!success) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json({ message: 'Ticket status updated successfully' });
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add comment to ticket
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        const commentId = await Ticket.addComment(
            req.params.id,
            req.user.id,
            comment
        );

        res.status(201).json({ 
            message: 'Comment added successfully', 
            commentId 
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
