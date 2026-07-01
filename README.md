# Project Management App

A full-stack project management dashboard built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication.

## Overview

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT stored in secure cookies
- **Features:** user auth, project CRUD, task CRUD, dashboard stats, role-aware access control

## Folder structure

- `client/` — React frontend
- `server/` — Express backend

## Local setup

### 1. Install server dependencies

```bash
cd server
npm install
```

### 2. Configure backend environment

Copy the server example and fill values:

```bash
cp .env.example .env
```

Required variables:

- `PORT` — backend listening port (default: `5000`)
- `MONGO_URI` — MongoDB connection string
- `CLIENT_URL` — frontend URL for CORS (default: `http://localhost:5173`)
- `JWT_SECRET` — strong secret for JWT signing
- `JWT_EXPIRES_IN` — token expiry (example: `7d`)

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure frontend environment

Copy the client example and update the API base URL:

```bash
cp .env.example .env
```

Required variables:

- `VITE_API_BASE_URL` — backend API base URL, for example `http://localhost:5000/api`

### 5. Run locally

Start the backend:

```bash
cd ../server
npm run dev
```

Start the frontend:

```bash
cd ../client
npm run dev
```

Open the app in the browser at `http://localhost:5173`.

## Production build

Build the frontend:

```bash
cd client
npm run build
```

Then start the backend:

```bash
cd ../server
npm start
```

If serving the frontend separately, point `CLIENT_URL` at the deployed frontend origin and set `VITE_API_BASE_URL` accordingly.

## API reference

### Authentication

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — log in
- `POST /api/auth/logout` — log out
- `GET /api/auth/me` — get current authenticated user

### Projects

- `GET /api/projects` — list accessible projects
- `POST /api/projects` — create a new project
- `GET /api/projects/:id` — get a project by id
- `PUT /api/projects/:id` — update a project
- `DELETE /api/projects/:id` — delete a project

### Tasks

- `GET /api/tasks` — list tasks created or assigned to the user
- `POST /api/tasks` — create a new task
- `GET /api/tasks/:id` — get task details
- `PUT /api/tasks/:id` — update a task
- `DELETE /api/tasks/:id` — delete a task

### Dashboard

- `GET /api/dashboard/stats` — aggregated counts and recent items
- `GET /api/dashboard/charts` — chart data for project and task metrics

## Deployment notes

- Keep `.env` files out of source control.
- Use a strong `JWT_SECRET` in production.
- Use HTTPS and set `CLIENT_URL` to your deployed frontend domain.
- Set `VITE_API_BASE_URL` to the production backend URL.
- Confirm MongoDB access and network permissions for the deployed environment.

## GitHub readiness checklist

- [x] Root `README.md` added
- [x] `server/.env.example` present with required variables
- [x] `client/.env.example` present with required variables
- [x] `.gitignore` excludes `node_modules`, `.env`, and build artifacts
- [x] Backend routes validate IDs and return consistent API responses
- [x] Auth cookie handling is configured for production security
- [x] Frontend API client validates response shape and handles errors

## Notes

This project separates the backend and frontend into two folders. Run each side independently during development.
