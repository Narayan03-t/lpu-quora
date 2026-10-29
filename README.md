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

## 🔐 Environment Variables

Create a `.env` file in backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_connection
```

## 👨‍💻 Author

**Bipul Singhaniya**

* GitHub: https://github.com/bipulsinghaniya
* Portfolio: https://bipul-portfolio-tzyl.vercel.app

## ⭐ If you like this project

Give this repository a star ⭐
