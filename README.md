# Chatbot Project

## Overview

This project consists of two main services:

- **Frontend:** Angular application
- **Backend:** Dockerized backend service

During development, the frontend runs locally on the developer's machine, while the backend runs inside Docker.

## Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Configure Environment Variables

Make sure the required `.env` file exists in the project root.

This file is used by Docker Compose to configure the backend service.

### 3. Start the Backend

The backend runs inside Docker.

```bash
docker compose up -d backend
```

Check running containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs -f backend
```

### 4. Setup Frontend

Install frontend dependencies:

```bash
npm install
```

### 5. Configure API Proxy

The frontend uses `proxy.conf.json` to forward API requests to the backend.

Example configuration:

```json
{
  "/api": {
    "target": "http://localhost:9000",
    "secure": false,
    "changeOrigin": true
  }
}
```

### 6. Run Frontend

Start the Angular development server:

```bash
npm start
```

The frontend will be available at:

http://localhost:4200

Changes to frontend source files are automatically detected during development.

## Development Workflow

During development:

- Run the backend using Docker Compose.
- Run the frontend locally using Angular CLI.
- Edit frontend source files using your preferred IDE.
- Angular automatically reloads the application when source files change.

## Environment Configuration
Before starting the backend, create your .env file based on the provided .env.example file.
Windows (PowerShell):

Copy-Item .env.example .env

Then open .env and fill in the required environment variables with your own values.
Important: Do not commit the .env file or share its secrets. Keep .env.example 
updated with the required variable names, but without real credentials or sensitive values.

### Backend

Start backend:

```bash
docker compose up -d backend
```

Stop backend:

```bash
docker compose stop backend
```

Restart backend:

```bash
docker compose restart backend
```

View backend logs:

```bash
docker compose logs -f backend
```

### Frontend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Build frontend:

```bash
npm run build
```

## Production

The project includes a Dockerfile for building the Angular application and serving the production build using Nginx.

Production frontend and backend images are defined in `docker-compose.yml`.

## Notes

- Do not commit `node_modules` to Git.
- Do not commit sensitive environment variables or secrets.
- Make sure the backend is running before testing API requests.
- The frontend development server uses port `4200`.
- The API proxy expects the backend to be accessible at `localhost:9000`.

