import { useEffect, useState } from "react";
import api from "../services/api";

function Books({ setPage }) {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    stock: "",
  });

  // ==========================================
  // GET ALL BOOKS
  // ==========================================
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);

      setError(
        error.response?.data?.message ||
          "Gagal mengambil data buku."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
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
      title: "",
      author: "",
      category: "",
      year: "",
      stock: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // TAMBAH / UPDATE BUKU
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const data = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        year: Number(formData.year),
        stock: Number(formData.stock),
      };

      let response;

      // UPDATE
      if (editingId) {
        response = await api.put(
          `/books/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Buku berhasil diperbarui.");
      }

      // CREATE
      else {
        response = await api.post(
          "/books",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Buku berhasil ditambahkan.");
      }

      console.log("Response:", response.data);

      resetForm();

      await fetchBooks();
    } catch (error) {
      console.error("Gagal menyimpan buku:", error);

      setError(
        error.response?.data?.message ||
          "Gagal menyimpan data buku."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT BUKU
  // ==========================================
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      year: book.year,
      stock: book.stock,
    });

    setEditingId(book._id);
    setShowForm(true);

    setMessage("");
    setError("");
  };

  // ==========================================
  // HAPUS BUKU
  // ==========================================
  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus buku ini?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Buku berhasil dihapus:", response.data);

      setMessage("Buku berhasil dihapus.");

      await fetchBooks();
    } catch (error) {
      console.error("Gagal menghapus buku:", error);

      setError(
        error.response?.data?.message ||
          "Gagal menghapus buku."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div>
      <h1>Secure UNSIA Digital Library</h1>

      <h2>📚 Data Buku</h2>

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
          : "➕ Tambah Buku"}
      </button>

      <br />
      <br />

      {/* ======================================
          MESSAGE
      ====================================== */}

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

      {/* ======================================
          FORM
      ====================================== */}

      {showForm && (
        <div>
          <h3>
            {editingId
              ? "✏️ Edit Buku"
              : "➕ Tambah Buku Baru"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Judul Buku</label>
              <br />

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul buku"
                required
              />
            </div>

            <br />

            <div>
              <label>Penulis</label>
              <br />

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Masukkan nama penulis"
                required
              />
            </div>

            <br />

            <div>
              <label>Kategori</label>
              <br />

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Contoh: Informatika"
                required
              />
            </div>

            <br />

            <div>
              <label>Tahun</label>
              <br />

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Contoh: 2026"
                required
              />
            </div>

            <br />

            <div>
              <label>Stok</label>
              <br />

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Contoh: 5"
                min="0"
                required
              />
            </div>

            <br />

            <button type="submit" disabled={saving}>
              {saving
                ? "Menyimpan..."
                : editingId
                ? "💾 Simpan Perubahan"
                : "💾 Simpan Buku"}
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

      {/* ======================================
          DAFTAR BUKU
      ====================================== */}

      <h3>📖 Daftar Buku</h3>

      {loading && <p>Memuat data buku...</p>}

      {!loading && books.length === 0 && (
        <p>Belum ada data buku.</p>
      )}

      {!loading && books.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Kategori</th>
              <th>Tahun</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>

                <td>{book.title}</td>

                <td>{book.author}</td>

                <td>{book.category}</td>

                <td>{book.year}</td>

                <td>{book.stock}</td>

                <td>
                  <button
                    onClick={() => handleEdit(book)}
                  >
                    ✏️ Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDelete(book._id)
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

export default Books;