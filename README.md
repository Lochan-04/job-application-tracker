# Placement Tracker

A MERN-style job application tracker built for placement-focused workflows. The project keeps the current polished layout while moving the application architecture toward:

- MongoDB for data
- Express for the API
- React for the frontend
- Node.js for the runtime

## Stack

- Frontend: React + Vite + Tailwind utility classes + custom CSS
- Backend: Express + Mongoose + JWT auth
- Database: MongoDB

## Project structure

```text
client/   React frontend
server/   Express + MongoDB backend
```

## Features

- User signup and login
- Protected dashboard
- Application create, edit, delete, and detail views
- Status, priority, follow-up, and recruiter tracking
- Dashboard summaries for offers, interviews, follow-ups, and recent activity
- Demo seed script for quick setup

## Local setup

1. Copy `server/.env.example` to `server/.env`
2. Set your MongoDB connection string in `MONGODB_URI`
3. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Run locally

In separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Or from the root:

```bash
npm run dev
```

## Seed demo data

```bash
cd server
npm run seed
```

Demo account:

- username: `demo`
- password: `demo12345`

## Notes

- The old Django files are still present in the repo right now as legacy/reference code during the transition.
- The active direction of the project is the new MERN client/server setup.
