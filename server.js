// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Add it to .env');
  process.exit(1);
}

// Connect DB
connectDB(MONGODB_URI);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingsRoutes);

// Root
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Synergia Bookings API is running' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (optional enhanced)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
