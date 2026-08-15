const Member = require("../models/member");

// ==========================================
// GET ALL MEMBERS
// ==========================================
const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET MEMBER BY ID
// ==========================================
const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Anggota tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE MEMBER
// ==========================================
const createMember = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address
    } = req.body;

    // Validasi input
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, nomor telepon, dan alamat wajib diisi"
      });
    }

    // Cek email sudah terdaftar
    const existingMember = await Member.findOne({ email });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Email anggota sudah terdaftar"
      });
    }

    // Buat anggota baru
    const member = await Member.create({
      name,
      email,
      phone,
      address
    });

    res.status(201).json({
      success: true,
      message: "Anggota berhasil ditambahkan",
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE MEMBER
// ==========================================
const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address
    } = req.body;

    // Validasi input
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, nomor telepon, dan alamat wajib diisi"
      });
    }

    // Update anggota
    const member = await Member.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Anggota tidak ditemukan
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Anggota tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Anggota berhasil diperbarui",
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE MEMBER
// ==========================================
const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    // Anggota tidak ditemukan
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Anggota tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      message: "Anggota berhasil dihapus",
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};