const Booking = require('../models/booking');

// @desc    Buat booking baru dengan cek bentrok
exports.createBooking = async (req, res) => {
  try {
    const { court, date, startTime, endTime, totalPrice } = req.body;


    if (!court || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const userId = req.user._id || req.user.id; 
    
    if (!userId) {
       return res.status(401).json({ message: 'User tidak terautentikasi dengan benar. Silakan login ulang.' });
    }


    const overlapping = await Booking.findOne({
      court: court,
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ 
        message: 'Jadwal bentrok! Lapangan sudah dipesan pada jam tersebut.' 
      });
    }


    const newBooking = new Booking({
      user: userId, 
      court,
      date,
      startTime,
      endTime,
      totalPrice
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);

  } catch (err) {

    console.error("Error creating booking:", err); 
    res.status(500).json({ message: err.message || 'Server Error saat membuat booking' });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('court');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('court');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil semua data booking", error: error.message });
  }
};