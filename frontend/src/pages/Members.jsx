import { useEffect, useState } from "react";
import api from "../services/api";

function Members({ setPage }) {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ==========================================
  // GET ALL MEMBERS
  // ==========================================
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data anggota:", error);

      setError(
        error.response?.data?.message ||
          "Gagal mengambil data anggota."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // CREATE / UPDATE MEMBER
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      let response;

      // UPDATE
      if (editingId) {
        response = await api.put(
          `/members/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Anggota berhasil diperbarui.");
      }

      // CREATE
      else {
        response = await api.post(
          "/members",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Anggota berhasil ditambahkan.");
      }

      console.log("Response:", response.data);

      resetForm();

      await fetchMembers();
    } catch (error) {
      console.error("Gagal menyimpan anggota:", error);

      setError(
        error.response?.data?.message ||
          "Gagal menyimpan data anggota."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT MEMBER
  // ==========================================
  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
    });

    setEditingId(member._id);
    setShowForm(true);

    setMessage("");
    setError("");
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================
  const handleDelete = async (memberId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus anggota ini?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/members/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Anggota berhasil dihapus:",
        response.data
      );

      setMessage("Anggota berhasil dihapus.");

      await fetchMembers();
    } catch (error) {
      console.error("Gagal menghapus anggota:", error);

      setError(
        error.response?.data?.message ||
          "Gagal menghapus anggota."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div>
      <h1>Secure UNSIA Digital Library</h1>

      <h2>👥 Data Anggota</h2>

      <button onClick={() => setPage("dashboard")}>
        ← Kembali ke Dashboard
      </button>

      <br />
      <br />

      <button
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setShowForm(true);
            setMessage("");
            setError("");
          }
        }}
      >
        {showForm
          ? "✖ Tutup Form"
          : "➕ Tambah Anggota"}
      </button>

      <br />
      <br />

      {/* PESAN */}

      {message && (
        <p>
          ✅ {message}
        </p>
      )}

      {error && (
        <p>
          ❌ {error}
        </p>
      )}

      {/* FORM */}

      {showForm && (
        <div>
          <h3>
            {editingId
              ? "✏️ Edit Anggota"
              : "➕ Tambah Anggota Baru"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Nama</label>
              <br />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama anggota"
                required
              />
            </div>

            <br />

            <div>
              <label>Email</label>
              <br />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </div>

            <br />

            <div>
              <label>Nomor Telepon</label>
              <br />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>

            <br />

            <div>
              <label>Alamat</label>
              <br />

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat"
                rows="3"
                required
              />
            </div>

            <br />

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : editingId
                ? "💾 Simpan Perubahan"
                : "💾 Simpan Anggota"}
            </button>

            {" "}

            <button
              type="button"
              onClick={resetForm}
            >
              Batal
            </button>
          </form>

          <hr />
        </div>
      )}

      {/* DATA ANGGOTA */}

      <h3>👥 Daftar Anggota</h3>

      {loading && (
        <p>Memuat data anggota...</p>
      )}

      {!loading && members.length === 0 && (
        <p>Belum ada data anggota.</p>
      )}

      {!loading && members.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>

                <td>{member.name}</td>

                <td>{member.email}</td>

                <td>{member.phone}</td>

                <td>{member.address}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(member)
                    }
                  >
                    ✏️ Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDelete(member._id)
                    }
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Members;