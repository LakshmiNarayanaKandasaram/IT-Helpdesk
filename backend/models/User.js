const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const { username, password, email, full_name, role } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, full_name, role || 'employee']
        );
        
        return result.insertId;
    }

    static async findByUsername(username) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, email, full_name, role FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getAllITStaff() {
        const [rows] = await db.execute(
            'SELECT id, username, email, full_name FROM users WHERE role = ?',
            ['it_staff']
        );
        return rows;
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
