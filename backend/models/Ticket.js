const db = require('../config/database');

class Ticket {
    static async create(ticketData) {
        const { title, description, category, priority, created_by } = ticketData;
        
        const [result] = await db.execute(
            'INSERT INTO tickets (title, description, category, priority, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, priority || 'medium', created_by]
        );
        
        return result.insertId;
    }

    static async findAll(userId, userRole) {
        let query;
        let params = [];

        if (userRole === 'employee') {
            query = `
                SELECT t.*, 
                       u1.full_name as creator_name,
                       u2.full_name as assignee_name
                FROM tickets t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.assigned_to = u2.id
                WHERE t.created_by = ?
                ORDER BY t.created_at DESC
            `;
            params = [userId];
        } else if (userRole === 'it_staff') {
            query = `
                SELECT t.*, 
                       u1.full_name as creator_name,
                       u2.full_name as assignee_name
                FROM tickets t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.assigned_to = u2.id
                WHERE t.assigned_to = ? OR t.status = 'open'
                ORDER BY t.created_at DESC
            `;
            params = [userId];
        } else {
            query = `
                SELECT t.*, 
                       u1.full_name as creator_name,
                       u2.full_name as assignee_name
                FROM tickets t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.assigned_to = u2.id
                ORDER BY t.created_at DESC
            `;
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT t.*, 
                    u1.full_name as creator_name,
                    u2.full_name as assignee_name,
                    u3.full_name as assigner_name
             FROM tickets t
             LEFT JOIN users u1 ON t.created_by = u1.id
             LEFT JOIN users u2 ON t.assigned_to = u2.id
             LEFT JOIN users u3 ON t.assigned_by = u3.id
             WHERE t.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async assignTicket(ticketId, assignedTo, assignedBy) {
        const [result] = await db.execute(
            'UPDATE tickets SET assigned_to = ?, assigned_by = ?, status = ? WHERE id = ?',
            [assignedTo, assignedBy, 'assigned', ticketId]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(ticketId, status, resolutionNotes = null) {
        let query;
        let params;

        if (status === 'resolved' && resolutionNotes) {
            query = 'UPDATE tickets SET status = ?, resolution_notes = ?, resolved_at = NOW() WHERE id = ?';
            params = [status, resolutionNotes, ticketId];
        } else {
            query = 'UPDATE tickets SET status = ? WHERE id = ?';
            params = [status, ticketId];
        }

        const [result] = await db.execute(query, params);
        return result.affectedRows > 0;
    }

    static async addComment(ticketId, userId, comment) {
        const [result] = await db.execute(
            'INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)',
            [ticketId, userId, comment]
        );
        return result.insertId;
    }

    static async getComments(ticketId) {
        const [rows] = await db.execute(
            `SELECT c.*, u.full_name 
             FROM ticket_comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.ticket_id = ?
             ORDER BY c.created_at ASC`,
            [ticketId]
        );
        return rows;
    }
}

module.exports = Ticket;
