# Team Task Manager

Team Task Manager is a production-ready full-stack MERN application for teams that need a clean workspace to manage projects, assign work, monitor task progress, and keep deadlines visible. It includes secure JWT authentication, role-based access, project and task management, dashboard analytics, and Railway deployment support.

## Features

- Secure signup and login with JWT authentication and password hashing
- Persistent login with protected frontend routes
- Admin/member role-based access
- Project creation, editing, deletion, and team membership management
- Task creation, assignment, editing, deletion, priority handling, and overdue tracking
- Dashboard analytics with Recharts visualizations
- Responsive modern UI built with React, Vite, and Tailwind CSS
- Express + MongoDB REST API with MVC structure, validation, and centralized error handling
- Seed script with realistic starter data
- Railway-ready root build/start workflow

## Tech Stack

- Frontend: React.js, Vite, React Router DOM, Axios, Tailwind CSS, React Hot Toast, Recharts
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, express-validator, cors, dotenv
- Deployment: Railway

## Folder Structure

```text
team-task-manager/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- app.js
|   |-- db.js
|   |-- package.json
|   |-- railway.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   `-- .env.example
|-- .env.example
|-- .gitignore
|-- package.json
|-- railway.json
`-- README.md
```

## MongoDB Atlas Setup Guide

1. Sign in to MongoDB Atlas and create a new project.
2. Create a free shared cluster.
3. Add a database user with a username and password.
4. Go to `Network Access` and allow your IP address or use `0.0.0.0/0` for development.
5. Open `Database` > `Connect` > `Drivers`.
6. Copy the MongoDB connection string and replace `<username>`, `<password>`, and the database name.
7. Paste that value into `MONGODB_URI` in `backend/.env`.

## Environment Variables

Root `.env.example` contains the combined reference. For local development, create:

- `backend/.env`
- `frontend/.env`

Backend variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend variables:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation Steps

1. Clone the repository.
2. Create `backend/.env` and `frontend/.env` from the provided examples.
3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Commands to Run Frontend and Backend

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Optional sample data:

```bash
cd backend
npm run seed
```

Sample seeded credentials:

- Admin: `ava@teamtaskmanager.dev` / `Password123!`
- Member: `noah@teamtaskmanager.dev` / `Password123!`

## API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Projects:

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

Tasks:

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Dashboard:

- `GET /api/dashboard/stats`

Support:

- `GET /api/users`
- `GET /api/health`

## Railway Deployment Steps

1. Push this repository to GitHub.
2. Create a new Railway project and choose `Deploy from GitHub repo`.
3. Select this repository.
4. Add the backend environment variables in Railway:
   - `PORT`
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
5. Add the frontend API variable only if you are running the frontend separately. For the included single-service Railway setup, the backend serves the built frontend automatically.
6. Railway will use `railway.json` and the root `package.json` scripts to:
   - install backend and frontend dependencies
   - build the frontend
   - start the Express server
7. After deploy, set `CLIENT_URL` to your Railway public domain.

## Production Build Support

Root build:

```bash
npm run build
```

Root start:

```bash
npm start
```

The backend serves `frontend/dist` automatically when the frontend has been built.

## GitHub Push Commands

```bash
git init
git add .
git commit -m "Build production-ready MERN team task manager"
git branch -M main
git remote add origin https://github.com/your-username/team-task-manager.git
git push -u origin main
```

## Screenshots

This repository does not include captured screenshots yet. After running the app locally or deploying it, capture:

- Login page
- Dashboard analytics page
- Projects page
- Project details page
- Tasks page

## Live Demo

Add your deployed Railway URL here after publish, for example:

`https://your-app-name.up.railway.app`

## Notes for Beginners

- Start the backend before the frontend.
- If authentication fails, verify `JWT_SECRET` and `MONGODB_URI`.
- If the frontend cannot reach the API, confirm `VITE_API_URL`.
- If CORS errors appear, ensure `CLIENT_URL` matches the frontend URL exactly.

## License

This project is ready for personal, educational, and portfolio use.
