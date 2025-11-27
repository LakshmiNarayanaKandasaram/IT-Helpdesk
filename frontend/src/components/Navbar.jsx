import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-logo-brand">
                    <img src="/help-desk.png" alt="Help Desk Logo" className="nav-logo" />
                    <Link to="/dashboard" className="nav-brand">
                        IT Help Desk
                    </Link>
                </div>
                
                <div className="nav-menu">
                    <Link to="/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                    {user.role === 'employee' && (
                        <Link to="/tickets/new" className="nav-link">
                            New Ticket
                        </Link>
                    )}
                    <div className="nav-user">
                        <h3>{user.full_name}</h3>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
