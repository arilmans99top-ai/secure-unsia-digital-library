const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah Authorization header tersedia
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak ditemukan."
      });
    }

    // Ambil token setelah kata Bearer
    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Simpan data user dari token
    req.user = decoded;

    // Lanjut ke controller berikutnya
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa."
    });
  }
};

module.exports = protect;