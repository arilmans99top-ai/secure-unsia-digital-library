const Book = require("../models/book");

// ==========================================
// GET ALL BOOKS
// ==========================================
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE BOOK
// ==========================================
const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      category,
      year,
      stock
    } = req.body;

    // Validasi input
    if (!title || !author || !category || !year) {
      return res.status(400).json({
        success: false,
        message: "Judul, penulis, kategori, dan tahun wajib diisi"
      });
    }

    // Buat buku baru
    const book = await Book.create({
      title,
      author,
      category,
      year,
      stock: stock !== undefined ? stock : 1
    });

    res.status(201).json({
      success: true,
      message: "Buku berhasil ditambahkan",
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE BOOK
// ==========================================
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      author,
      category,
      year,
      stock
    } = req.body;

    // Validasi input
    if (!title || !author || !category || !year) {
      return res.status(400).json({
        success: false,
        message: "Judul, penulis, kategori, dan tahun wajib diisi"
      });
    }

    // Cari dan update buku
    const book = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        category,
        year,
        stock
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Buku tidak ditemukan
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Buku berhasil diperbarui",
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE BOOK
// ==========================================
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cari dan hapus buku
    const book = await Book.findByIdAndDelete(id);

    // Buku tidak ditemukan
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Buku berhasil dihapus",
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook
};