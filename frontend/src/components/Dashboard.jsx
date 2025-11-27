import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TicketList from './TicketList';
import api from '../services/api';

function Dashboard({ user }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchTickets = async () => {
        try {
            const data = await api.getTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredTickets = () => {
        if (filter === 'all') return tickets;
        return tickets.filter(ticket => ticket.status === filter);
    };

    const getTicketStats = () => {
        return {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'open').length,
            assigned: tickets.filter(t => t.status === 'assigned').length,
            inProgress: tickets.filter(t => t.status === 'in_progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length,
        };
    };

    if (loading) {
        return <div className="loading">Loading tickets...</div>;
    }

    const stats = getTicketStats();

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {user.full_name}!</h1>
                <p>Role: {user.role.replace('_', ' ').toUpperCase()}</p>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Tickets</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Open</h3>
                    <p className="stat-number">{stats.open}</p>
                </div>
                <div className="stat-card">
                    <h3>Assigned</h3>
                    <p className="stat-number">{stats.assigned}</p>
                </div>
                <div className="stat-card">
                    <h3>In Progress</h3>
                    <p className="stat-number">{stats.inProgress}</p>
                </div>
                <div className="stat-card">
                    <h3>Resolved</h3>
                    <p className="stat-number">{stats.resolved}</p>
                </div>
            </div>

            <div className="ticket-actions">
                {user.role === 'employee' && (
                    <Link to="/tickets/new" className="btn btn-primary">
                        Create New Ticket
                    </Link>
                )}
                
                <div className="filter-buttons">
                    <button 
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={filter === 'open' ? 'active' : ''}
                        onClick={() => setFilter('open')}
                    >
                        Open
                    </button>
                    <button 
                        className={filter === 'assigned' ? 'active' : ''}
                        onClick={() => setFilter('assigned')}
                    >
                        Assigned
                    </button>
                    <button 
                        className={filter === 'in_progress' ? 'active' : ''}
                        onClick={() => setFilter('in_progress')}
                    >
                        In Progress
                    </button>
                    <button 
                        className={filter === 'resolved' ? 'active' : ''}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <TicketList 
                tickets={getFilteredTickets()} 
                user={user}
                onUpdate={fetchTickets}
            />
        </div>
    );
}

export default Dashboard;
