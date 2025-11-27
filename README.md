# Project Structure

```
helpdesk/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tickets.js
│   │   └── users.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketList.jsx
│   │   │   ├── TicketDetail.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── database/
│   └── schema.sql
└── password/
    └── hashpassword.js
```

## Techstacks Used

- Frontend : ReactJS
- Backend : Express (NodeJS)
- Database : MySQL

## DATABASE

### Database Schema

All database tables and their corresponding columns are detailed in the file below.

- database/schema.sql

### Backend Configuration

Connecting to DB using express is done in the file below.

- backend/config/database.js

## Steps to run the project

### Environment Variables

MySQL database should be provided in the file below.

- backend/.env

If this file already exists, update the credentials within it; otherwise, create a new file and provide the credentials as shown below.

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=helpdesk_db
JWT_SECRET=your-secret-key-here
```

### Database

Run the schema.sql in your MySQL database

### Backend Setup:

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup:

```bash
cd frontend
npm install
npm start
```

## Additional Information

Passwords are saved in their hashed form in the database. Refer to the file below to see how bcrypt is used for hashing.

- password/hashpassword.js

## Features Implemented:

- **Role-based access control** (Employee, Team Lead, IT Staff)
- **Ticket Creation** by employees
- **Ticket Assignment** by team leads
- **Status Updates** by IT staff
- **Comment System** for ticket communication
- **Dashboard** with statistics and filters
