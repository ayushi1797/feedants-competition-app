# Feedants Competition Details — Full Stack Assignment

A functional Competition Details module built with **React Native (Expo)**, **Node.js + Express**, and **MongoDB**.

## Features

- Dynamic competition details from the backend
- Competition lifecycle states: upcoming, open, full, ongoing and ended
- User registration state
- Remaining participation spots
- Registration/cancellation APIs
- MongoDB persistence
- Duplicate-registration protection
- Capacity checks on the server
- Basic validation and error handling
- Clean component structure
- Simple mobile UI that can be adjusted to match the provided design reference

## Project structure

```text
feedants-competition-app/
├── mobile/                 # React Native / Expo app
└── server/                 # Node.js + Express + MongoDB API
```

## 1. Run the backend

```bash
cd server
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/feedants
DEMO_USER_ID=66c000000000000000000001
```

Then:

```bash
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

Update `mobile/src/config.js` with the API address appropriate for your device/emulator.

For a physical Android phone, use your computer's local network IP, for example:

```js
export const API_BASE_URL = "http://192.168.1.10:5000/api";
```

## Demo user

The seed script creates a demo user and a competition. The app uses the demo user ID from the backend for this assignment.

## Main API

- `GET /api/health`
- `GET /api/competitions/:competitionId?userId=<userId>`
- `POST /api/competitions/:competitionId/register`
- `DELETE /api/competitions/:competitionId/register`

## Important implementation detail

Registration is not decided by the mobile app. The server checks the competition lifecycle, registration window, capacity and duplicate participation before writing the registration.

The participation collection has a unique compound index on:

```text
competitionId + userId
```

This helps prevent duplicate registrations when multiple requests arrive close together.

## Assumptions

- Authentication is represented by a demo user ID for the assignment prototype.
- Competition capacity is optional; a null capacity means unlimited participation.
- Registration is allowed only during the configured registration window.
- The UI is intentionally kept simple and close to the supplied Competition Details concept; the backend and business rules are the main functional part of this submission.

## Production improvements

For a production version I would add real authentication, automated tests, monitoring, rate limiting, CI/CD, stronger transaction handling, image optimisation and load testing.
