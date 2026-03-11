const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/padel_booking';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Terhubung ke MongoDB Lokal'))
  .catch((err) => console.error('❌ Gagal koneksi MongoDB:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});