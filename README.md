# WorkHive

A premium, modern SaaS platform for team collaboration and task management, inspired by the design aesthetics of Linear and Vercel.

## Features
- **Authentication**: JWT-based secure signup and login.
- **Dark/Light Mode**: Full theme support with persistence.
- **Kanban Board**: Drag-and-drop task management.
- **Dashboard**: Activity logs and Recharts analytics.
- **Project Management**: Create projects and assign members.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (v4), Framer Motion, Recharts, @hello-pangea/dnd
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Getting Started

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder (or use the one provided):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5001
```
4. Start the backend server: `npm run dev` (runs on port 5001)

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `frontend` folder:
```
VITE_API_URL=http://localhost:5001/api
```
4. Start the Vite development server: `npm run dev` (runs on port 5173 by default)

Open `http://localhost:5173` in your browser.

## Assignment Coverage
- Users can sign up and log in with JWT authentication.
- Any authenticated user can create a project; the project creator acts as that project's admin.
- Project admins can add or remove members and create, edit, assign, or delete tasks.
- Members can view only their project tasks assigned to them and update their task status.
- The dashboard shows total tasks, completed tasks, overdue tasks, tasks by status, tasks per user, and recent activity.

## Design Aesthetic
The application relies heavily on custom CSS variables defined in `frontend/src/index.css` paired with Tailwind CSS to achieve a premium, glassmorphic, and dynamic feel.

## Deployment
- **Backend on Railway**:
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables: `MONGO_URI`, `JWT_SECRET`, and Cloudinary variables if attachment upload is enabled.
  - Do not manually set `PORT` on Railway; Railway injects it automatically.
- **Frontend on Railway**:
  - Root directory: `frontend`
  - Build command: `npm install && npm run build`
  - Start command: `npm start`
  - Environment variable: `VITE_API_URL=https://your-backend-url.up.railway.app/api`
- Add the live application URL, GitHub repository URL, and demo video URL here before submission.
