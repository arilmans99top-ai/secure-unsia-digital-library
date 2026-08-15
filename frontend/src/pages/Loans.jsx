import { useEffect, useState } from "react";
import api from "../services/api";

function Loans({ setPage, filterStatus = "all" }) {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    book: "",
    member: "",
  });

  // ==========================================
  // AMBIL DATA PEMINJAMAN
  // ==========================================
  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoans(response.data.data || []);
    } catch (error) {
      console.error(
        "Gagal mengambil data peminjaman:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Gagal mengambil data peminjaman."
      );
    }
  };

  // ==========================================
  // AMBIL DATA BUKU
  // ==========================================
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data.data || []);
    } catch (error) {
      console.error(
        "Gagal mengambil data buku:",
        error
      );
    }
  };

  // ==========================================
  // AMBIL DATA ANGGOTA
  // ==========================================
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(response.data.data || []);
    } catch (error) {
      console.error(
        "Gagal mengambil data anggota:",
        error
      );
    }
  };

  // ==========================================
  // LOAD SEMUA DATA
  // ==========================================
  const fetchAllData = async () => {
    setLoading(true);
    setError("");

    await Promise.all([
      fetchLoans(),
      fetchBooks(),
      fetchMembers(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
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
      book: "",
      member: "",
    });

    setShowForm(false);
  };

  // ==========================================
  // CREATE LOAN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/loans",
        {
          book: formData.book,
          member: formData.member,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Peminjaman berhasil:",
        response.data
      );

      setMessage("Peminjaman berhasil dibuat.");

      resetForm();

      // Refresh data
      await fetchAllData();
    } catch (error) {
      console.error(
        "Gagal membuat peminjaman:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Gagal membuat peminjaman."
      );

      setLoading(false);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RETURN BOOK
  // ==========================================
  const handleReturn = async (loanId) => {
    const confirmReturn = window.confirm(
      "Apakah buku ini benar-benar sudah dikembalikan?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/loans/${loanId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Buku berhasil dikembalikan:",
        response.data
      );

      setMessage("Buku berhasil dikembalikan.");

      await fetchAllData();
    } catch (error) {
      console.error(
        "Gagal mengembalikan buku:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Gagal mengembalikan buku."
      );
    }
  };

  // ==========================================
  // FILTER STATUS
  // ==========================================
  const filteredLoans =
    filterStatus === "all"
      ? loans
      : loans.filter(
          (loan) => loan.status === filterStatus
        );

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div>
      <h1>Secure UNSIA Digital Library</h1>

      <h2>
        {filterStatus === "returned"
          ? "↩️ Data Pengembalian"
          : "📖 Data Peminjaman"}
      </h2>

      <button onClick={() => setPage("dashboard")}>
        ← Kembali ke Dashboard
      </button>

      <br />
      <br />

      {/* ======================================
          TOMBOL TAMBAH PEMINJAMAN
      ====================================== */}

      {filterStatus === "all" && (
        <>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
              setError("");
            }}
          >
            {showForm
              ? "✖ Tutup Form"
              : "➕ Peminjaman Baru"}
          </button>

          <br />
          <br />
        </>
      )}

      {/* ======================================
          PESAN
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
          FORM PEMINJAMAN
      ====================================== */}

      {showForm && filterStatus === "all" && (
        <div>
          <h3>📖 Buat Peminjaman Baru</h3>

          <form onSubmit={handleSubmit}>
            {/* PILIH BUKU */}

            <div>
              <label>Pilih Buku</label>
              <br />

              <select
                name="book"
                value={formData.book}
                onChange={handleChange}
                required
              >
                <option value="">
                  -- Pilih Buku --
                </option>

                {books
                  .filter(
                    (book) => book.stock > 0
                  )
                  .map((book) => (
                    <option
                      key={book._id}
                      value={book._id}
                    >
                      {book.title} - Stok: {book.stock}
                    </option>
                  ))}
              </select>
            </div>

            <br />

            {/* PILIH ANGGOTA */}

            <div>
              <label>Pilih Anggota</label>
              <br />

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
              >
                <option value="">
                  -- Pilih Anggota --
                </option>

                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name} - {member.email}
                  </option>
                ))}
              </select>
            </div>

            <br />

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Memproses..."
                : "📖 Pinjam Buku"}
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
          LOADING
      ====================================== */}

      {loading && (
        <p>Memuat data...</p>
      )}

      {/* ======================================
          DATA KOSONG
      ====================================== */}

      {!loading &&
        !error &&
        filteredLoans.length === 0 && (
          <p>
            {filterStatus === "returned"
              ? "Belum ada buku yang dikembalikan."
              : "Belum ada data peminjaman."}
          </p>
        )}

      {/* ======================================
          TABEL PEMINJAMAN
      ====================================== */}

      {!loading &&
        filteredLoans.length > 0 && (
          <table
            border="1"
            cellPadding="10"
          >
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Buku</th>
                <th>Anggota</th>
                <th>Tanggal Pinjam</th>
                <th>Tanggal Kembali</th>
                <th>Status</th>

                {filterStatus === "all" && (
                  <th>Aksi</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map(
                (loan, index) => (
                  <tr key={loan._id}>
                    <td>{index + 1}</td>

                    <td>
                      {loan.book?.title ||
                        "Buku tidak ditemukan"}
                    </td>

                    <td>
                      {loan.member?.name ||
                        "Anggota tidak ditemukan"}
                    </td>

                    <td>
                      {loan.loanDate
                        ? new Date(
                            loan.loanDate
                          ).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>

                    <td>
                      {loan.returnDate
                        ? new Date(
                            loan.returnDate
                          ).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>

                    <td>
                      {loan.status ===
                      "borrowed"
                        ? "📖 Dipinjam"
                        : "✅ Dikembalikan"}
                    </td>

                    {filterStatus ===
                      "all" && (
                      <td>
                        {loan.status ===
                        "borrowed" ? (
                          <button
                            onClick={() =>
                              handleReturn(
                                loan._id
                              )
                            }
                          >
                            ↩️ Kembalikan
                          </button>
                        ) : (
                          <span>
                            Sudah dikembalikan
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
    </div>
  );
}

export default Loans;