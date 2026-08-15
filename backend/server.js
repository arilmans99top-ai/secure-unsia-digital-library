const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");

const app = express();

// ==========================================
// SECURITY & MIDDLEWARE
// ==========================================
app.use(helmet());
app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure UNSIA Digital Library API berjalan"
  });
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Terjadi kesalahan pada server"
        : err.message
  });
});

// ==========================================
// CONNECT DATABASE
// ==========================================
connectDB();

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});