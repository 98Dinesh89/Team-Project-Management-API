# Team Task Management API

A backend REST API for managing teams, projects, and tasks with authentication, role-based authorization, data validation, Redis caching, and background job processing.

## Overview

The Team Task Management API provides the backend functionality for a collaborative project management application. Users can create teams, manage members, organize projects, and track tasks while access is controlled through resource-level authorization.

The project focuses on building a modular, maintainable backend and understanding how different backend components work together.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **Validation:** Zod
- **Caching and rate limiting:** Redis
- **Background jobs:** BullMQ and Redis
- **Email:** Nodemailer
- **Security:** Helmet, CORS, HTTP-only cookies
- **Development tools:** Git, GitHub, Nodemon, Postman

## Features

### Authentication and Authorization

- JWT-based authentication and protected routes.
- Password hashing with bcrypt.
- Team ownership and membership checks.
- Project- and task-level access control through reusable middleware.
- HTTP-only authentication cookies.

### Teams, Projects, and Tasks

- Create teams and manage team members.
- Restrict member management to team owners.
- Create projects associated with teams.
- Create and retrieve tasks associated with projects.
- Assign tasks to eligible team members.
- Support task filtering, sorting, pagination, search, and field selection.

### Validation and Error Handling

- Request validation using reusable Zod schemas.
- Centralized error-handling middleware.
- Handling of common Mongoose errors and duplicate-key conflicts.
- Consistent validation of incoming data.

### Performance and Background Processing

- Redis caching for task listings.
- Version-based cache invalidation.
- Atomic Redis rate limiting using Lua scripts.
- BullMQ queues for asynchronous email jobs.
- Retry handling and exponential backoff for failed jobs.

## Architecture

The application separates responsibilities into routes, controllers, models, middleware, and utility modules.

- **Routes:** Define API endpoints and middleware chains.
- **Controllers:** Handle request-specific business logic.
- **Models:** Define MongoDB schemas and relationships.
- **Middleware:** Handle authentication, authorization, and validation.
- **Utilities and services:** Support configuration, caching, queues, and email delivery.

Authorization follows the resource hierarchy:

`User → Team → Project → Task`

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Redis for caching, rate limiting, and background jobs

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd <your-project-folder>
npm install
```

Create a `.env` file in the project root and configure the environment variables used by your application.

Typical configuration includes:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
REDIS_URL=your_redis_connection_url
FRONTEND_URL=http://localhost:5173
```

Add any additional variables required by your email service and application configuration. Use the exact variable names expected by your code. Never commit real credentials or secrets.

Start the development server:

```bash
npm run dev
```

Start the application in production mode:

```bash
npm start
```

Ensure MongoDB and Redis are running and configured before using the corresponding features.

## API Endpoints

The following are the main resource endpoints. Authentication is required for protected operations.

| Method | Endpoint                         | Purpose                   |
| ------ | -------------------------------- | ------------------------- |
| POST   | `/api/teams`                     | Create a team             |
| GET    | `/api/teams`                     | Retrieve the user's teams |
| POST   | `/api/teams/:teamId/members`     | Add a team member         |
| POST   | `/api/teams/:teamId/projects`    | Create a project          |
| GET    | `/api/teams/:teamId/projects`    | Retrieve team projects    |
| POST   | `/api/projects/:projectId/tasks` | Create a task             |
| GET    | `/api/projects/:projectId/tasks` | Retrieve project tasks    |

Authentication endpoints and any additional CRUD routes depend on the current route configuration. Refer to the route files for the complete list.

## Key Learning Outcomes

- Designing RESTful APIs with Express.js.
- Implementing authentication and resource-level authorization.
- Modeling relationships using MongoDB and Mongoose.
- Validating requests and handling errors consistently.
- Using Redis for caching and atomic rate limiting.
- Processing asynchronous jobs with BullMQ.
- Organizing backend code into reusable modules.

## Future Improvements

- Add automated unit and integration tests.
- Add API documentation with OpenAPI/Swagger.
- Introduce structured logging and monitoring.
- Add integration tests for authorization and cache invalidation.
- Deploy the application with production-ready configuration.

---

**Note:** This project is intended as a backend engineering learning project. The implemented features and setup requirements should be verified against the current repository.
