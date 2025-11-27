import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TicketForm({ user }) {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const categories = [
        'Hardware',
        'Software',
        'Network',
        'Account/Access',
        'Email',
        'Printer',
        'Other'
    ];

    const handleChange = (e) => {
        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.createTicket(ticket);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ticket-form-container">
            <h2>Create New Ticket</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter a brief title for the issue"
                        value={ticket.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Give a detailed description of the issue"
                        value={ticket.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={ticket.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={ticket.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TicketForm;
