const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bookingRoutes = require('./routes/bookingRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Routes
app.use('/api/bookings', bookingRoutes);

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});