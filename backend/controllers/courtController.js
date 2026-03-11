const Court = require('../models/court');

// @desc    Mendapatkan semua lapangan (Read)
// @route   GET /api/courts
exports.getCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.status(200).json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data lapangan', error: error.message });
  }
};

// @desc    Menambah lapangan baru (Create)
// @route   POST /api/courts
exports.createCourt = async (req, res) => {
  try {
    const newCourt = await Court.create(req.body);
    res.status(201).json(newCourt);
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat lapangan', error: error.message });
  }
};

// @desc    Mengupdate data lapangan (Update)
// @route   PUT /api/courts/:id
exports.updateCourt = async (req, res) => {
  try {
    const updatedCourt = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourt) return res.status(404).json({ message: 'Lapangan tidak ditemukan' });
    res.status(200).json(updatedCourt);
  } catch (error) {
    res.status(400).json({ message: 'Gagal mengupdate lapangan', error: error.message });
  }
};

// @desc    Menghapus lapangan (Delete)
// @route   DELETE /api/courts/:id
exports.deleteCourt = async (req, res) => {
  try {
    const deletedCourt = await Court.findByIdAndDelete(req.params.id);
    if (!deletedCourt) return res.status(404).json({ message: 'Lapangan tidak ditemukan' });
    res.status(200).json({ message: 'Lapangan berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal menghapus lapangan', error: error.message });
  }
};