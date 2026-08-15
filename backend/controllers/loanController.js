const Loan = require("../models/loan");
const Book = require("../models/book");
const Member = require("../models/member");

// ==========================================
// GET ALL LOANS
// ==========================================
const getLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find()
      .populate("book")
      .populate("member")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET LOAN BY ID
// ==========================================
const getLoanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id)
      .populate("book")
      .populate("member");

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE LOAN
// ==========================================
const createLoan = async (req, res, next) => {
  try {
    const { book, member } = req.body;

    // Validasi input
    if (!book || !member) {
      return res.status(400).json({
        success: false,
        message: "ID buku dan ID anggota wajib diisi"
      });
    }

    // Cari buku
    const existingBook = await Book.findById(book);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan"
      });
    }

    // Cek stok buku
    if (existingBook.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Stok buku habis"
      });
    }

    // Cari anggota
    const existingMember = await Member.findById(member);

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Anggota tidak ditemukan"
      });
    }

    // Buat transaksi peminjaman
    const loan = await Loan.create({
      book,
      member
    });

    // Kurangi stok buku
    existingBook.stock -= 1;
    await existingBook.save();

    // Ambil data lengkap
    const populatedLoan = await Loan.findById(loan._id)
      .populate("book")
      .populate("member");

    res.status(201).json({
      success: true,
      message: "Peminjaman berhasil dibuat",
      data: populatedLoan
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// RETURN BOOK
// ==========================================
const returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ditemukan"
      });
    }

    // Cek apakah sudah dikembalikan
    if (loan.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Buku sudah dikembalikan"
      });
    }

    // Update status
    loan.status = "returned";
    loan.returnDate = new Date();

    await loan.save();

    // Kembalikan stok buku
    const book = await Book.findById(loan.book);

    if (book) {
      book.stock += 1;
      await book.save();
    }

    // Ambil data lengkap
    const populatedLoan = await Loan.findById(loan._id)
      .populate("book")
      .populate("member");

    res.status(200).json({
      success: true,
      message: "Buku berhasil dikembalikan",
      data: populatedLoan
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE LOAN
// ==========================================
const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Cari data peminjaman
    const loan = await Loan.findById(id);

    // Jika tidak ditemukan
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ditemukan"
      });
    }

    // Jangan hapus peminjaman yang masih aktif
    if (loan.status === "borrowed") {
      return res.status(400).json({
        success: false,
        message: "Peminjaman masih aktif. Buku harus dikembalikan terlebih dahulu."
      });
    }

    // Hapus data peminjaman
    await Loan.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Data peminjaman berhasil dihapus",
      data: loan
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getLoans,
  getLoanById,
  createLoan,
  returnBook,
  deleteLoan
};