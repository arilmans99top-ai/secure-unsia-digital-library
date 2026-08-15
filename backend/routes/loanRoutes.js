const express = require("express");

const {
  getLoans,
  getLoanById,
  createLoan,
  returnBook,
  deleteLoan
} = require("../controllers/loanController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua peminjaman
router.get("/", protect, getLoans);

// GET peminjaman berdasarkan ID
router.get("/:id", protect, getLoanById);

// POST membuat peminjaman
router.post("/", protect, createLoan);

// PUT mengembalikan buku
router.put("/:id/return", protect, returnBook);

// DELETE data peminjaman
router.delete("/:id", protect, deleteLoan);

module.exports = router;