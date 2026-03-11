const express = require('express');
const router = express.Router();
const { getCourts, createCourt, updateCourt, deleteCourt } = require('../controllers/courtController');
const { protect } = require('../middleware/authMiddleware');

// --- PERHATIKAN PERUBAHAN DI SINI ---

// Jalur GET (melihat lapangan) dibuat publik (tanpa 'protect')
// Jalur POST (menambah lapangan) tetap butuh 'protect' (login)
router.route('/')
  .get(getCourts) 
  .post(protect, createCourt);

// Jalur Update & Delete tetap butuh 'protect'
router.route('/:id')
  .put(protect, updateCourt)
  .delete(protect, deleteCourt);

module.exports = router;