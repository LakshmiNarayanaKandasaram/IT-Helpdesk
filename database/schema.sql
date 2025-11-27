-- Create database
CREATE DATABASE IF NOT EXISTS helpdesk_db;
USE helpdesk_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('employee', 'team_lead', 'it_staff') NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    status ENUM('open', 'assigned', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    created_by INT NOT NULL,
    assigned_to INT,
    assigned_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- Ticket comments table
CREATE TABLE ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample users
INSERT INTO users (username, password, email, full_name, role) VALUES
('narayana', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'narayana@narayana.com', 'Narayana', 'team_lead'),
('eswar', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'eswar@narayana.com', 'Eswar Kumar', 'team_lead'),
('pradeep', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'pradeep@narayana.com', 'Pradeep Kumar', 'employee'),
('lokesh', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'lokesh@narayana.com', 'Lokesh Kumar', 'employee'),
('avinash', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'avi@narayana.com', 'Avinash Kumar', 'employee'),
('kushal', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'kushal@narayana.com', 'Kushal', 'employee'),
('lakshmi', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'lakshmi@narayana.com', 'Lakshmi Narayana', 'it_staff'),
('madan', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'madan@narayana.com', 'Madan Mohan', 'it_staff'),
('jagadeesh', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'jagadeesh@narayana.com', 'Jagadeesh Kumar', 'it_staff'),
('nuthan', '$2b$10$KldRCpCP.LMoeNUzxsGAIeWtkRVmZX5n.VTU8otyHL.luLoPOmq/m', 'nuthan@narayana.com', 'Nuthan', 'it_staff');

