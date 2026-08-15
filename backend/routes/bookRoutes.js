const express = require("express");

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua buku
router.get("/", protect, getBooks);

// POST tambah buku
router.post("/", protect, createBook);

// PUT update buku berdasarkan ID
router.put("/:id", protect, updateBook);

// DELETE hapus buku berdasarkan ID
router.delete("/:id", protect, deleteBook);

module.exports = router;