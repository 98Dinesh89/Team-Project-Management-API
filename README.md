# Team Task Management API

**A backend application for collaborative team, project, and task management, built with Node.js, Express.js, MongoDB, Redis, and BullMQ.**

## Overview

The Team Task Management API is a backend project designed to manage collaborative workflows through structured REST APIs. It allows authenticated users to create teams, manage team membership, organize projects, and handle tasks while enforcing access permissions at each level of the resource hierarchy.

The primary focus of this project is backend engineering: building APIs that handle requests correctly, protect resources from unauthorized access, validate incoming data, and maintain predictable behavior when errors occur.

Beyond standard CRUD operations, the project explores backend concerns such as query optimization, caching, rate limiting, and asynchronous job processing. These features helped me understand how individual components work together to form a maintainable and reliable server-side application.

## Key Features

### 1. RESTful API Development

- Organized API endpoints around users, teams, projects, and tasks.
- Separated routing, request handling, database models, and middleware.
- Implemented endpoints for creating and retrieving teams, managing team members, creating projects, and managing tasks.
- Used MongoDB references to represent relationships between resources.
- Implemented task filtering, sorting, pagination, search, and field selection to support flexible data retrieval.

### 2. Authentication and Access Control

Security is a central part of the application. A user should not be able to access or modify a resource simply because they know its ID.

- Implemented JWT-based authentication.
- Hashed passwords using bcrypt before storing them.
- Protected routes using authentication middleware.
- Used HTTP-only cookies to handle authentication tokens.
- Implemented role- and resource-based authorization for teams, projects, and tasks.
- Restricted team-member management to authorized team owners.
- Checked team membership before allowing access to associated projects and tasks.

The authorization flow uses reusable middleware to identify the authenticated user and verify access to the requested resource before the controller performs its operation.

### 3. Database Modeling and Querying

The application uses MongoDB with Mongoose to model related entities and enforce application-level data rules.

**Core models:**

- **User:** Represents an authenticated user.
- **Team:** Stores team ownership and membership information.
- **Project:** Associates projects with teams and their creators.
- **Task:** Stores task details, project associations, assignment information, status, priority, and due dates.

The relationships follow a hierarchical structure:

`User → Team → Project → Task`

This structure supports resource-level authorization and makes it possible to retrieve related data through Mongoose queries and population where appropriate.

The project also explores database query design, filtering, pagination, and constraints such as preventing duplicate task titles within the same project.

### 4. Request Validation and Error Handling

APIs should not assume that incoming requests contain valid data. The application uses Zod schemas and centralized error handling to make request processing more predictable.

- Validates incoming request data using reusable Zod schemas.
- Keeps validation logic separate from business logic.
- Uses middleware to validate requests before they reach controllers.
- Centralizes error handling instead of duplicating response logic across endpoints.
- Handles common database errors, including invalid identifiers, Mongoose validation failures, and duplicate-key conflicts.

These mechanisms help the application respond more consistently when users submit invalid data or operations fail.

### 5. Redis Caching and Rate Limiting

The project incorporates Redis to explore performance and request-control mechanisms beyond basic database operations.

- Caches task-listing results to reduce repeated database queries.
- Uses version-based cache invalidation to help prevent outdated cached results from being served after relevant changes.
- Implements rate limiting with an atomic Redis operation using Lua scripts.

This part of the project helped me understand cache invalidation, concurrent requests, and why atomic operations matter when multiple requests interact with shared state.

### 6. Asynchronous Background Jobs

Some operations do not need to block the main HTTP request while they are processed. The project uses BullMQ and Redis to handle background email jobs.

- Separates job creation from job processing.
- Uses a queue producer to enqueue work and a worker to process jobs.
- Integrates Nodemailer for email delivery.
- Configures retries and exponential backoff for failed jobs.
- Supports different email job types, including verification and reminder workflows.

This architecture provides a foundation for handling asynchronous work independently of the request-response lifecycle.

### 7. Security and Configuration

The application includes several security and configuration practices:

- Password hashing using bcrypt.
- JWT verification for protected routes.
- HTTP-only authentication cookies.
- Cookie settings based on the application environment.
- Helmet middleware for security-related HTTP headers.
- Configurable CORS settings, including credential support where required.
- Environment variables for secrets, database connections, and application configuration.

These practices help separate application configuration from source code and establish a foundation for safer deployment.

## Technology Stack

| Technology     | Purpose                                        |
| -------------- | ---------------------------------------------- |
| Node.js        | JavaScript runtime for server-side development |
| Express.js     | HTTP server and REST API routing               |
| MongoDB        | Persistent document database                   |
| Mongoose       | Database schemas, models, and queries          |
| JWT            | Authentication tokens                          |
| bcrypt         | Password hashing                               |
| Zod            | Request data validation                        |
| Redis          | Caching and rate limiting                      |
| BullMQ         | Background job queue                           |
| Nodemailer     | Email delivery                                 |
| Helmet         | Security-related HTTP headers                  |
| CORS           | Cross-origin request configuration             |
| Git and GitHub | Version control and source code management     |

## Architecture and Request Lifecycle

The application separates responsibilities into dedicated modules to make the code easier to understand, test, and extend.

**Typical request lifecycle:**

1. **Route:** Matches the HTTP method and endpoint.
2. **Authentication middleware:** Verifies the user's JWT and attaches the authenticated user to the request.
3. **Authorization middleware:** Checks ownership or membership for the requested resource.
4. **Validation middleware:** Validates the incoming data against the relevant schema.
5. **Controller:** Executes the operation and coordinates the required business logic.
6. **Model/database layer:** Reads or modifies MongoDB documents.
7. **Response/error handler:** Returns the result or forwards the error to centralized error-handling middleware.

The precise middleware order varies by endpoint, but the overall goal is to keep authentication, authorization, validation, and business logic separate.

## Example API Endpoints

The following table lists representative endpoints implemented in the project.

| Method | Endpoint                         | Description                           |
| ------ | -------------------------------- | ------------------------------------- |
| `POST` | `/api/teams`                     | Create a team                         |
| `GET`  | `/api/teams`                     | Retrieve teams the user belongs to    |
| `POST` | `/api/teams/:teamId/members`     | Add a member to a team                |
| `POST` | `/api/teams/:teamId/projects`    | Create a project for a team           |
| `GET`  | `/api/teams/:teamId/projects`    | Retrieve projects belonging to a team |
| `POST` | `/api/projects/:projectId/tasks` | Create a task within a project        |
| `GET`  | `/api/projects/:projectId/tasks` | Retrieve tasks belonging to a project |

Protected endpoints require authentication, and resource-specific middleware enforces the relevant access rules.

Consult the route files for the complete list of endpoints and the exact request and response formats.

## Getting Started

### Prerequisites

Install or configure the following:

- Node.js and npm
- MongoDB
- Redis for caching, rate limiting, and background job processing

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root. The following is an illustrative configuration; use the exact variable names and formats expected by your application.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
REDIS_URL=your_redis_connection_url
FRONTEND_URL=http://localhost:5173
```

Configure any additional variables required by your email service and application setup.

**Important:** Never commit real credentials, JWT secrets, or private connection strings to GitHub.

### 3. Start the development server

```bash
npm run dev
```

### 4. Start the production server

```bash
npm start
```

Make sure the required database and Redis services are running before testing the features that depend on them. If the email worker runs as a separate process, start it using the worker command defined in your project.

## Testing the API

You can use Postman or another HTTP client to exercise the API endpoints.

Suggested scenarios:

- Register or authenticate a user and access a protected endpoint.
- Attempt to access a team without the required membership.
- Attempt to add a team member as a non-owner.
- Submit invalid request data and verify that validation errors are handled.
- Request tasks using filtering, sorting, pagination, and search parameters.
- Verify that duplicate task titles within the same project are rejected when the database constraint applies.
- Exercise cached task listings and verify that relevant updates invalidate stale results.
- Trigger a background email job and inspect its processing and retry behavior.

These scenarios are useful for checking both successful operations and important failure cases. Automated test coverage should be added and documented separately once implemented.

## Engineering Concepts Explored

This project has helped me develop a practical understanding of:

- Designing REST APIs around resources and HTTP methods.
- Authentication versus authorization.
- Middleware composition and separation of responsibilities.
- Database relationships and query design with MongoDB.
- Input validation and centralized error handling.
- Handling invalid identifiers and database constraint violations.
- Cache invalidation and atomic operations in Redis.
- Rate limiting under concurrent requests.
- Asynchronous processing, retries, and exponential backoff.
- Secure configuration and environment-specific behavior.

Rather than treating these as isolated features, the project brings them together in one backend application.

## Future Improvements

Potential next steps include:

- Adding comprehensive unit and integration tests.
- Documenting endpoints using OpenAPI/Swagger.
- Adding structured logging and operational monitoring.
- Measuring query performance and improving indexes based on actual query patterns.
- Adding CI checks and an automated deployment workflow.
- Expanding API documentation with example requests and responses.

## About This Project

This is a hands-on backend engineering project focused on understanding how to design, implement, and improve server-side APIs.

The emphasis is on correctness, access control, maintainability, and reliable request processing—not just making endpoints work under ideal conditions.

**Repository:** [Add your GitHub repository URL here]
