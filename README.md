# Messaging App

> A full-stack messaging application with group chats, media uploads, and user authentication.

**Live Demo:** [messaging-app-rzgu.onrender.com](https://messaging-app-rzgu.onrender.com)

---

## Overview

Messaging App is a full-stack chat application where users can sign up, create or join group conversations, send text messages, and upload media. Built with a React frontend and a Node.js + Express backend connected to a PostgreSQL database hosted on Supabase.

---

## Features

- User authentication via Passport.js
- Create and join group conversations
- Send and receive messages
- Upload and share media attachments via Multer
- Persistent sessions and global state management
- Fully typed with TypeScript

---

## Tech Stack

| Category         | Technology            |
| ---------------- | --------------------- |
| Framework        | React + Vite          |
| Language         | TypeScript            |
| Styling          | Tailwind CSS          |
| Routing          | React Router          |
| Forms            | React Hook Form + Zod |
| UI Components    | Radix UI              |
| State Management | Zustand               |
| Backend          | Node.js + Express.js  |
| Database         | PostgreSQL            |
| Storage          | Supabase              |
| File Uploads     | Multer                |
| Auth             | Passport.js           |

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm or your preferred package manager
- A running PostgreSQL database
- A Supabase project (for storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/nofuenterr/messaging-app.git

# Navigate into the project directory
cd messaging-app

# Install dependencies for both client and server
npm install
npm install --prefix client
npm install --prefix server
```

### Environment Variables

Create a `.env` file inside the `server` directory and fill in the required values:

```bash
# App
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# Database (choose one or both depending on your setup)
DATABASE_URL=
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=
DB_NAME=
DB_PORT=5432

# Auth
ADMIN_PASSWORD=
SECRET=
JWT_SECRET=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Create a `.env` file inside the `client` directory and fill in the required values:

```bash
VITE_API_URL=http://localhost:3000/
```

### Running the App

```bash
# Start both client and server concurrently in development mode
npm run dev
```

### Build

```bash
# Build the client for production
npm run build

# Start the production server
npm run start
```

---

## To-do

### In Progress / Upcoming

- [ ] Per-group and main profile loading skeleton
- [ ] Message attachments
- [ ] Blocked user warning on groups
- [ ] Copy, forward, bump, and pin message features
- [ ] Radix Scroll Area on skeleton/loading pages
- [ ] Seen indicator
- [ ] Online indicator
- [ ] Live chatting
- [ ] Delete message (for you only)
- [ ] Loading states on buttons
- [ ] Disable buttons while loading to prevent duplicate actions

---

## Credits

This project is for personal/portfolio use. I do not own the rights to any third-party assets used.

---

\*Developed by **RR Nofuente\***
