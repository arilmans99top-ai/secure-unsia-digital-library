const express = require("express");

const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require("../controllers/memberController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua anggota
router.get("/", protect, getMembers);

// GET anggota berdasarkan ID
router.get("/:id", protect, getMemberById);

// POST tambah anggota
router.post("/", protect, createMember);

// PUT update anggota berdasarkan ID
router.put("/:id", protect, updateMember);

// DELETE hapus anggota berdasarkan ID
router.delete("/:id", protect, deleteMember);

module.exports = router;