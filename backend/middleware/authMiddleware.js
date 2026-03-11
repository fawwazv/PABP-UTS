const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Cek apakah ada header Authorization dan diawali dengan 'Bearer '
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token saja (Memecah string "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token menggunakan secret key dari .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Masukkan payload token (id user) ke dalam request
      // Ini berguna agar kita tahu SIAPA yang sedang melakukan booking
      req.user = decoded;

      next(); // Izinkan masuk ke route selanjutnya (CRUD)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Akses ditolak, token tidak valid' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Akses ditolak, tidak ada token JWT' });
  }
};

module.exports = { protect };