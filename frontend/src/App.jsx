import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Loans from "./pages/Loans";

function App() {
  const token = localStorage.getItem("token");

  const [page, setPage] = useState(
    token ? "dashboard" : "login"
  );

  // ==========================================
  // LOGIN
  // ==========================================

  if (page === "login") {
    return <Login />;
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  if (page === "dashboard") {
    return (
      <Dashboard
        setPage={setPage}
      />
    );
  }

  // ==========================================
  // BUKU
  // ==========================================

  if (page === "books") {
    return (
      <Books
        setPage={setPage}
      />
    );
  }

  // ==========================================
  // ANGGOTA
  // ==========================================

  if (page === "members") {
    return (
      <Members
        setPage={setPage}
      />
    );
  }

  // ==========================================
  // PEMINJAMAN
  // ==========================================

  if (page === "loans") {
    return (
      <Loans
        setPage={setPage}
        filterStatus="all"
      />
    );
  }

  // ==========================================
  // PENGEMBALIAN
  // ==========================================

  if (page === "returns") {
    return (
      <Loans
        setPage={setPage}
        filterStatus="returned"
      />
    );
  }

  return null;
}

export default App;