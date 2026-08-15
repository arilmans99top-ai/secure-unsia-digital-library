function Dashboard({ setPage }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Secure UNSIA Digital Library</h1>

      <h2>🏠 Dashboard</h2>

      <p>
        Selamat datang di Sistem Informasi Perpustakaan Digital.
      </p>

      <hr />

      <h3>📋 Menu Utama</h3>

      <div>
        <button onClick={() => setPage("books")}>
          📚 Buku
        </button>

        {" "}

        <button onClick={() => setPage("members")}>
          👥 Anggota
        </button>

        {" "}

        <button onClick={() => setPage("loans")}>
          📖 Peminjaman
        </button>

        {" "}

        <button
          onClick={() => setPage("returns")}
        >
          ↩️ Pengembalian
        </button>
      </div>

      <br />

      <hr />

      <button onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Dashboard;