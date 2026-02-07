# Startupops Platform

Startupops Platform is a comprehensive web application designed to streamline startup operations. It features a modern, responsive frontend and a robust backend to handle data and user interactions efficiently.

## 🚀 Features

- **Modern User Interface**: Built with React and styled using Tailwind CSS for a sleek, responsive design.
- **Interactive Elements**: Utilizes Framer Motion for smooth animations and Recharts for data visualization.
- **Secure Authentication**: Implements JWT-based authentication with secure password hashing via bcryptjs.
- **RESTful API**: specific backend endpoints managed by Express.js.
- **Database Management**: Uses MongoDB with Mongoose for structured data modeling.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (powered by [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management & Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Authentication**: JSON Web Token (JWT) & Bcryptjs
- **Utilities**: Dotenv, Cors

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (running locally or a cloud instance like MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your configuration (example):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 👥 Contributors

- **Sachin Kumar** - Full Stack Developer
- **Nisha Kumari** - Frontend Developer
- **Ashwani Kumar Mishra** - Frontend Developer

## 📄 License

This project is licensed under the ISC License.
