const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const User = require('./models/User');
const seedData = require('./seedData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const novelRoutes = require('./routes/novels');
const chapterRoutes = require('./routes/chapters');
const awardRoutes = require('./routes/awards');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/novels', novelRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'WriteUp',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Start Database & Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is brand new
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Empty database detected. Populating initial demo dataset...');
      await seedData();
      console.log('✅ Initial demo dataset ready!');
    }

    app.listen(PORT, () => {
      console.log(`🚀 WriteUp API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();
