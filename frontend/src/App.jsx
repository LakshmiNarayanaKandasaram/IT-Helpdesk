import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TicketForm from './components/TicketForm';
import TicketDetail from './components/TicketDetail';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="App">
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <Routes>
                <Route 
                    path="/login" 
                    element={<Login onLogin={handleLogin} />} 
                />
                <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/tickets/new" 
                    element={user ? <TicketForm user={user} /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/tickets/:id" 
                    element={user ? <TicketDetail user={user} /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/" 
                    element={<Navigate to={user ? "/dashboard" : "/login"} />} 
                />
            </Routes>
        </div>
    );
}

export default App;
