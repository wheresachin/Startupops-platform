# StartupOps Platform

StartupOps is a web platform that helps early-stage startups manage execution, team collaboration, idea validation, and growth in one place. It provides task and milestone tracking, structured feedback, real-time analytics, and role-based access for founders, teams, mentors, and investors. All data is fetched from a live MongoDB Atlas database.

Built for **Udyamitsav ’26 – Techpreneur Hackathon**.

---

## 🚀 Features
- Role-based authentication (Founder, Team, Mentor, Investor)
- Central startup workspace
- Task & milestone management (Kanban)
- Structured feedback & idea validation
- Real-time analytics dashboard
- Investor & mentor dashboards
- Founder-based subscription system
- Razorpay payment integration

---

## 🛠️ Tech Stack
**Frontend:** React (Vite), Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express, MongoDB Atlas, JWT, bcryptjs  

---

## ⚙️ Setup (Short)

### Backend
```bash
cd backend
npm install
npm run dev
Create .env:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

Frontend
cd frontend
npm install
npm run dev
Open: http://localhost:5173

🔐 Security
JWT authentication

Role-based access control

Secure password hashing

Environment variable configuration

👥 Contributors
@wheresachin – Full Stack Developer

@nishapandey96 – Frontend Developer

@itashwani1 – Frontend Developer

