# Research Project Tracker – Frontend

A React + TypeScript frontend for the Research Project Tracker system, built for
CMJD Batch 110/111, Assignment 2. Connects to a Spring Boot backend using
JWT-based authentication and role-based access control.

## Tech Stack

- React 19 + TypeScript (Create React App)
- React Router v6 — client-side routing
- Axios — backend HTTP communication
- Context API — global auth state
- React Bootstrap + Bootstrap 5 — UI/styling

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd research-tracker
   npm install
   ```

2. Configure the backend URL. By default the app calls
   `http://localhost:8080/api`. To point elsewhere, create a `.env` file in
   the project root:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

3. Start the Spring Boot backend first, then run the frontend:
   ```bash
   npm start
   ```
   The app runs at [http://localhost:3000](http://localhost:3000).

4. Build for production:
   ```bash
   npm run build
   ```

## Backend API Endpoints Used

| Method | Endpoint                | Purpose                        |
|--------|--------------------------|---------------------------------|
| POST   | `/auth/login`            | Sign in, returns JWT            |
| POST   | `/auth/signup`           | Register a new user             |
| GET    | `/projects`              | List projects                   |
| POST   | `/projects`              | Create a project                |
| GET    | `/projects/{id}`         | Get project details             |
| PUT    | `/projects/{id}`         | Update a project                |
| DELETE | `/projects/{id}`         | Delete a project                |
| GET    | `/milestones`            | List milestones                 |
| POST   | `/milestones`            | Create a milestone              |
| PUT    | `/milestones/{id}`       | Update a milestone (status)     |
| DELETE | `/milestones/{id}`       | Delete a milestone              |
| GET    | `/documents`             | List documents                  |
| POST   | `/documents`             | Upload a document (multipart)   |
| GET    | `/admin/users`           | List users (ADMIN only)         |

All requests except login/signup automatically include
`Authorization: Bearer <token>` via an Axios interceptor. A 401 response
clears the token and redirects to `/login`.

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Login, Register
│   └── Layout/        # NavigationBar
├── context/
│   └── AuthContext.tsx  # JWT storage, decode, login/logout state
├── pages/
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── Milestones.tsx
│   ├── Documents.tsx
│   └── AdminPanel.tsx
├── services/
│   └── api.ts          # Axios instance + interceptors
└── utils/
    └── types.ts         # Shared TypeScript interfaces
```

## Roles & Access

- `ADMIN` — full access, including `/admin` user management panel
- Authenticated users — Projects, Milestones, Documents
- Unauthenticated visitors — redirected to `/login`

## Screenshots / Demo

_Add screenshots or a demo link here before submission._
