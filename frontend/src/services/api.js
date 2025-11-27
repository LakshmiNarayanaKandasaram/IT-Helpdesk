const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    }

    // Auth endpoints
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    logout() {
        this.clearToken();
    }

    // Ticket endpoints
    async getTickets() {
        return this.request('/tickets');
    }

    async getTicket(id) {
        return this.request(`/tickets/${id}`);
    }

    async createTicket(ticketData) {
        return this.request('/tickets', {
            method: 'POST',
            body: JSON.stringify(ticketData),
        });
    }

    async assignTicket(ticketId, assignedTo) {
        return this.request(`/tickets/${ticketId}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ assigned_to: assignedTo }),
        });
    }

    async updateTicketStatus(ticketId, status, resolutionNotes) {
        return this.request(`/tickets/${ticketId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, resolution_notes: resolutionNotes }),
        });
    }

    async addComment(ticketId, comment) {
        return this.request(`/tickets/${ticketId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
        });
    }

    // User endpoints
    async getITStaff() {
        return this.request('/users/it-staff');
    }

    async getCurrentUser() {
        return this.request('/users/me');
    }
}

export default new ApiService();
