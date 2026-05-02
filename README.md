# WorkHive

**Built for busy bees.**

WorkHive is a full-stack team task management web application where users can create projects, manage members, assign tasks, track progress, and collaborate through comments and attachments. It is designed as a simplified Trello/Asana-style workspace with project-level role-based access control.

## Live Links

- **Live App:** https://workhive-frontend-production.up.railway.app
- **Backend API:** https://workhive-backend-production-9624.up.railway.app

## Features

- **Authentication**
  - User signup with name, email, and password
  - Secure login using JWT
  - Password hashing with bcrypt

- **Project Management**
  - Any authenticated user can create a project
  - Project creator becomes the project admin
  - Project admins can add/remove members
  - Project creators can edit and delete projects

- **Task Management**
  - Create tasks with title, description, due date, priority, and assignees
  - Kanban workflow: `To Do`, `In Progress`, `Done`
  - Project admins can edit and delete tasks
  - Members can update status for assigned tasks only
  - Task comments and file attachments

- **Dashboard**
  - Total tasks
  - Completed tasks
  - Overdue tasks
  - Tasks by status
  - Tasks per user
  - Recent activity timeline

- **Role-Based Access Control**
  - Backend-enforced project membership checks
  - Backend-enforced task edit/delete restrictions
  - UI hides unauthorized actions
  - Members only see tasks assigned to them

- **User Experience**
  - Responsive React interface
  - Dark/light theme support
  - Drag-and-drop Kanban board
  - Calendar task view
  - Toast notifications for success/error states

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- FullCalendar
- `@hello-pangea/dnd`
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Multer
- Cloudinary

## Folder Structure

```text
WorkHive/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB Atlas database
- Cloudinary account, required only for attachment upload

### 1. Clone The Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd WorkHive
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5001
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

### Backend

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `PORT` | Local backend port. Railway injects this automatically in production |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API URL. Example: `https://your-backend.up.railway.app/api` |

## API Overview

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Users

```text
GET /api/users
PUT /api/users/:id/role
```

### Projects

```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
PUT    /api/projects/:id/members
GET    /api/projects/users
```

### Tasks

```text
POST   /api/tasks
GET    /api/tasks/project/:projectId
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PUT    /api/tasks/:id/status
POST   /api/tasks/:id/comments
POST   /api/tasks/:id/attachments
```

### Dashboard

```text
GET /api/dashboard/stats
```

## Role And Permission Rules

| Action | Project Creator/Admin | Member |
| --- | --- | --- |
| Create project | Yes | Yes |
| Edit project | Yes, creator only | No |
| Delete project | Yes, creator only | No |
| Manage project members | Yes | No |
| Create task | Yes | No |
| Edit task | Yes | No |
| Delete task | Yes | No |
| View assigned tasks | Yes | Yes |
| Update assigned task status | Yes | Yes |
| Comment/upload on assigned task | Yes | Yes |

## Railway Deployment

Deploy the backend and frontend as **two separate Railway services** from the same GitHub repository.

### 1. Push Code To GitHub

```bash
git add .
git commit -m "Prepare WorkHive for deployment"
git push origin main
```

### 2. Deploy Backend

In Railway:

1. Create a new project.
2. Choose **Deploy from GitHub repo**.
3. Select this repository.
4. Set **Root Directory**:

```text
backend
```

5. Set **Build Command**:

```text
npm install
```

6. Set **Start Command**:

```text
npm start
```

7. Add backend variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not manually set `PORT` on Railway. Railway provides it automatically.

8. Generate a public backend domain.
9. Test the backend URL:

```text
https://your-backend.up.railway.app/
```

Expected response:

```text
WorkHive API is running...
```

### 3. Deploy Frontend

In the same Railway project:

1. Create a new service.
2. Choose the same GitHub repository.
3. Set **Root Directory**:

```text
frontend
```

4. Set **Build Command**:

```text
npm install && npm run build
```

5. Set **Start Command**:

```text
npm start
```

6. Add frontend variable:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

7. Generate a public frontend domain.
8. Open the frontend URL and test signup/login.

## Deployment Checklist

- Backend service deployed successfully
- Backend public URL opens and returns API status text
- Frontend service deployed successfully
- `VITE_API_URL` points to the backend Railway URL with `/api`
- User can register and log in
- User can create a project
- Project creator can add members
- Project creator can create/edit/delete tasks
- Member can only update assigned task status
- Dashboard loads analytics

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm start
```

## Validation

The project has been checked with:

```bash
cd frontend
npm ci
npm run build
```

The backend dependency lockfile has also been aligned for Railway `npm ci` compatibility.

## Author

**Ayush Raj**

## License

This project is built for assignment/demo purposes.
