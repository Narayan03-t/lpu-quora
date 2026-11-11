# LPU Quora

A community-driven Q&A platform for Lovely Professional University students where users can ask questions, share answers, and interact with the campus community.

## 🚀 Live Demo

Frontend: https://lpuquora-frontend.onrender.com

## 📌 Features

- User Authentication (Register / Login)
- JWT-based secure authentication
- Secure logout using Redis token blacklist
- Ask questions
- Answer questions
- Category-based filtering (Exams, Hostel, Events)
- Search questions
- Community discussion interface
- Responsive UI

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Redis (Token management)

### Deployment

* Frontend: Render
* Backend: Render
* Database: MongoDB Atlas

## 📂 Project Structure

```
lpu-quora
│
├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   └── utils
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── config
```

## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/bipulsinghaniya/lpu-quora.git
```

### 2️⃣ Install dependencies

Frontend

```
cd frontend
npm install
npm run dev
```

Backend

```
cd backend
npm install
npm start
```

### Local development with Docker

Start MongoDB and Redis with Docker:

```
docker run -d --name lpu-quora-mongo -p 27017:27017 -v lpu-quora-mongo-data:/data/db mongo:8
docker run -d --name lpu-quora-redis -p 6379:6379 redis:7-alpine
```

The local backend configuration uses `mongodb://127.0.0.1:27017/lpu_quora`,
Redis on port `6379`, and the frontend on `http://localhost:5173`.

For Google sign-in during local development, add these authorized JavaScript
origins to the Google OAuth client configured by `VITE_GOOGLE_CLIENT_ID`:

```
http://localhost:5173
http://127.0.0.1:5173
```

The backend also needs `GOOGLE_CLIENT_ID` to match that client ID. Email
verification and password reset additionally require `BREVO_API_KEY` and
`SENDER_EMAIL` in `backend/.env`.

## 🚀 Deploying the existing Render services

Push the project to the GitHub repository connected to your existing Render
services. In Render, use these settings:

### Backend service

* **Root directory:** `backend`
* **Build command:** `npm install`
* **Start command:** `npm start`
* **Health check path:** `/`

Set these backend environment variables in Render:

```
PORT=10000
CLIENT_URL=https://your-frontend-service.onrender.com
MONGO_URI=your_mongodb_atlas_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASS=your_redis_password
JWT_SECRET=your_long_random_secret
GOOGLE_CLIENT_ID=your_google_web_client_id
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email
```

Use the MongoDB Atlas and Redis provider connection details for the deployed
service. Do not use the local Docker values in production.

### Frontend service

* **Root directory:** `frontend`
* **Build command:** `npm install && npm run build`
* **Publish directory:** `dist`

Set this frontend environment variable in Render:

```
VITE_API_URL=https://your-backend-service.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

After deployment, add the deployed frontend URL to Google Cloud under
**Authorized JavaScript origins**, for example:

```
https://your-frontend-service.onrender.com
```

Then update the backend `CLIENT_URL` to that exact URL and redeploy the
backend. Never commit production secrets or `.env` files.

## 🔐 Environment Variables

Create a `.env` file in backend folder:

```
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

`REDIS_URL` is not used by this backend; Redis is configured with
`REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASS`.
