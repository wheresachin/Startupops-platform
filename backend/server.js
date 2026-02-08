const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const taskRoutes = require('./routes/taskRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes'); // We will require inline or uncomment this if used
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', // Local Vite
    'https://startupops-platform.vercel.app', // Vercel Production
    'https://startupops-platform-git-main-wheresachins-projects.vercel.app', // Vercel Preview
    'https://startupops-platform-*.vercel.app' // Wildcard for previews
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pitch', require('./routes/pitchRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/investor', require('./routes/investorRoutes'));
app.use('/api/mentor', require('./routes/mentorRoutes'));
app.use('/api/access', require('./routes/accessRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/pitch', require('./routes/pitchRoutes'));

app.get('/', (req, res) => {
    res.send('StartupOps API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
