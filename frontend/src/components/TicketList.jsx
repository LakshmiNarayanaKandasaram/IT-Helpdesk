import React from 'react';
import { Link } from 'react-router-dom';

function TicketList({ tickets, user }) {
    const getPriorityClass = (priority) => {
        return `priority-${priority}`;
    };

    const getStatusClass = (status) => {
        return `status-${status.replace('_', '-')}`;
    };

    return (
        <div className="ticket-list">
            <h2>Tickets</h2>
            {tickets.length === 0 ? (
                <p className="no-tickets">No tickets found.</p>
            ) : (
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Assigned To</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.category}</td>
                                <td><span className={`badge ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span></td>
                                <td><span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span></td>
                                <td>{ticket.creator_name}</td>
                                <td>{ticket.assignee_name || '-'}</td>
                                <td>{new Date(ticket.created_at).toLocaleString()}</td>
                                <td>
                                    <Link to={`/tickets/${ticket.id}`} className="btn-view">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TicketList;
