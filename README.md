# LPU Quora

LPU Quora is a community Q&A platform for Lovely Professional University
students. Users can register, sign in, ask questions, filter questions by
category, search, and post answers.

## Features

- Email/password registration with email OTP verification
- Google authentication
- JWT-based login sessions
- Password reset using email OTP
- Ask questions and post answers
- Categories: Exams, Hostel, and Events
- Search questions
- Admin-only question and answer deletion endpoints
- Redis-backed OTP expiry, cooldowns, and token blacklist support
- Responsive React interface

> The project currently provides questions and answers. It does not contain a
> separate real-time chat feature or a completed admin dashboard UI.

## Technology

### Frontend

- React 19
- React Router
- Vite
- Tailwind CSS
- Axios
- Google OAuth

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Redis
- JSON Web Tokens
- bcryptjs
- Brevo email API

## Project structure

```text
lpu-quora/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis client
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── questionController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── userMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   └── Answer.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── questionRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── validator.js
│   ├── server.js
│   ├── package.json
│   └── .env                  # Local only; do not commit
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env                  # Local only; do not commit
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- Docker Desktop
- Google OAuth client for Google sign-in
- Brevo account for email OTP features

MongoDB Atlas and a hosted Redis provider are required for production
deployment. Docker MongoDB and Redis are used for local development.

## Local setup

### 1. Install dependencies

From the project directory:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 2. Start MongoDB and Redis

Start Docker Desktop, then run:

```powershell
docker run -d --name lpu-quora-mongo `
  -p 27017:27017 `
  -v lpu-quora-mongo-data:/data/db `
  mongo:8

docker run -d --name lpu-quora-redis `
  -p 6379:6379 `
  redis:7-alpine
```

If the containers already exist, use:

```powershell
docker start lpu-quora-mongo
docker start lpu-quora-redis
```

### 3. Configure the backend

Create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/lpu_quora
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASS=
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=your_google_web_client_id
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
```

`REDIS_URL` is not used by this backend. Redis uses `REDIS_HOST`,
`REDIS_PORT`, and `REDIS_PASS`.

### 4. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

The value of `VITE_GOOGLE_CLIENT_ID` must match the backend
`GOOGLE_CLIENT_ID`.

### 5. Configure Google OAuth

In Google Cloud Console, open the OAuth web client and add these **Authorized
JavaScript origins**:

```text
http://localhost:5173
http://127.0.0.1:5173
```

### 6. Start the backend

Open a terminal:

```powershell
cd "E:\Acedmics\SEM_7\CSE494\Project\lpu-quora\backend"
npm start
```

Expected output:

```text
Server running on port 5000
Redis Connected
MongoDB Connected
```

### 7. Start the frontend

Open a second terminal:

```powershell
cd "E:\Acedmics\SEM_7\CSE494\Project\lpu-quora\frontend"
npm run dev -- --host 127.0.0.1
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

Keep both terminals and both Docker containers running.

## Database design

MongoDB contains three main collections:

- `users`: account details, roles, password hashes, and Google identity data
- `questions`: question title, description, category, and creator ID
- `answers`: answer text, question ID, and creator ID

`Question.userId` identifies the question creator. `Answer.questionId`
identifies its question, and `Answer.userId` identifies its author. Mongoose
`populate()` is used to retrieve the answer author's name when questions are
loaded.

Redis stores temporary data such as registration OTPs, password-reset OTPs,
cooldown keys, and blocked JWTs. Permanent application data is stored in
MongoDB.

## API endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/verify-otp
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/verify-reset-otp
POST /api/auth/reset-password
```

### Questions and answers

```text
GET  /api/questions
POST /api/questions
POST /api/questions/:id/answer
```

Creating questions and answers requires a valid JWT in the
`Authorization: Bearer <token>` header.

### Admin actions

```text
DELETE /api/admin/question/:id
DELETE /api/admin/answer/:id
```

These endpoints require an authenticated user whose role is `admin`. A
dedicated admin monitoring dashboard is planned for a later version.

## Useful commands

Frontend:

```powershell
npm run dev
npm run build
npm run lint
```

Backend:

```powershell
npm start
```

Check backend health:

```text
http://localhost:5000/
```

Expected response:

```json
{"message":"LPU Quora API is running"}
```

## Deployment on Render

### Backend service

```text
Root directory: backend
Build command: npm install
Start command: npm start
Health check path: /
```

Backend production environment variables:

```env
PORT=10000
CLIENT_URL=https://your-frontend-service.onrender.com
MONGO_URI=your_mongodb_atlas_connection_string
REDIS_HOST=your_hosted_redis_host
REDIS_PORT=your_hosted_redis_port
REDIS_PASS=your_hosted_redis_password
JWT_SECRET=your_long_random_secret
GOOGLE_CLIENT_ID=your_google_web_client_id
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
```

### Frontend service

```text
Root directory: frontend
Build command: npm install && npm run build
Publish directory: dist
```

Frontend production environment variables:

```env
VITE_API_URL=https://your-backend-service.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

After deployment:

1. Add the deployed frontend URL to Google OAuth authorized origins.
2. Set backend `CLIENT_URL` to the exact deployed frontend URL.
3. Use MongoDB Atlas and hosted Redis values, not local Docker values.
4. Redeploy the backend after changing environment variables.

Never commit `.env` files, API keys, database passwords, or JWT secrets.

## License

This project is intended for educational and academic use.
