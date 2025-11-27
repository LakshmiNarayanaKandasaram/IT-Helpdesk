import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TicketDetail({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itStaff, setItStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [newComment, setNewComment] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        fetchTicket();
        if (user.role === 'team_lead') {
            fetchITStaff();
        }
    }, [id]);

    const fetchTicket = async () => {
        try {
            const data = await api.getTicket(id);
            setTicket(data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            setError('Failed to load ticket');
        } finally {
            setLoading(false);
        }
    };

    const fetchITStaff = async () => {
        try {
            const data = await api.getITStaff();
            setItStaff(data);
        } catch (error) {
            console.error('Error fetching IT staff:', error);
        }
    };

    const handleAssign = async () => {
        if (!selectedStaff) {
            setError('Please select a staff member');
            return;
        }

        try {
            await api.assignTicket(id, selectedStaff);
            await fetchTicket();
            setSelectedStaff('');
            setError('');
        } catch (error) {
            setError('Failed to assign ticket');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await api.updateTicketStatus(id, newStatus, resolutionNotes);
            await fetchTicket();
            setResolutionNotes('');
            setError('');
        } catch (error) {
            setError('Failed to update status');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.addComment(id, newComment);
            await fetchTicket();
            setNewComment('');
        } catch (error) {
            setError('Failed to add comment');
        }
    };

    if (loading) {
        return <div className="loading">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="error">Ticket not found</div>;
    }

    return (
        <div className="ticket-detail">
            <div className="ticket-header">
                <h2>Ticket #{ticket.id}: {ticket.title}</h2>
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    Back to Dashboard
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="ticket-info">
                <div className="info-grid">
                    <div className="info-item">
                        <label>Status:</label>
                        <span className={`badge status-${ticket.status.replace('_', '-')}`}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                    <div className="info-item">
                        <label>Priority:</label>
                        <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
                    </div>
                    <div className="info-item">
                        <label>Category:</label>
                        <span>{ticket.category}</span>
                    </div>
                    <div className="info-item">
                        <label>Created By:</label>
                        <span>{ticket.creator_name}</span>
                    </div>
                    <div className="info-item">
                        <label>Assigned To:</label>
                        <span>{ticket.assignee_name || '-'}</span>
                    </div>
                    <div className="info-item">
                        <label>Created At:</label>
                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                    {ticket.resolved_at && (
                        <div className="info-item">
                            <label>Resolved At:</label>
                            <span>{new Date(ticket.resolved_at).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="description-section">
                    <h3>Description</h3>
                    <p>{ticket.description}</p>
                </div>

                {ticket.resolution_notes && (
                    <div className="resolution-section">
                        <h3>Resolution Notes</h3>
                        <p>{ticket.resolution_notes}</p>
                    </div>
                )}

                {/* Team Lead Assignment Section */}
                {user.role === 'team_lead' && ticket.status === 'open' && (
                    <div className="assignment-section">
                        <h3>Assign to IT Staff</h3>
                        <select
                            value={selectedStaff}
                            onChange={e => setSelectedStaff(e.target.value)}
                        >
                            <option value="">Select IT Staff</option>
                            {itStaff.map(staff => (
                                <option key={staff.id} value={staff.id}>{staff.full_name}</option>
                            ))}
                        </select>
                        <button className="btn-assign" onClick={handleAssign}>Assign</button>
                    </div>
                )}

                {/* IT Staff Actions */}
                {user.role === 'it_staff' && ticket.assigned_to === user.id && (
                    <div className="staff-actions">
                        <h3>Update Status</h3>
                        <div>
                            <button className="btn-progress" onClick={() => handleStatusUpdate('in_progress')}>Mark In Progress</button>
                            <button className="btn-resolve" onClick={() => handleStatusUpdate('resolved')}>Mark Resolved</button>
                        </div>
                        <div className='resolution-notes'>
                            <input
                                type="text"
                                placeholder="Resolution notes"
                                value={resolutionNotes}
                                onChange={e => setResolutionNotes(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="comments-section">
                    <h3>Comments</h3>
                    <div className="comments-list">
                        {ticket.comments && ticket.comments.length > 0 ? (
                            ticket.comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <span>{comment.full_name}</span>
                                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                    <div>{comment.comment}</div>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit">Add Comment</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TicketDetail;
