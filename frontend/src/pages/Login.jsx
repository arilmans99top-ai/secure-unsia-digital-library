import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login berhasil:", response.data);

      // Simpan token JWT
      localStorage.setItem("token", response.data.token);

      // Pindah ke Dashboard
      window.location.href = "/";

    } catch (error) {
      console.error("Login gagal:", error);

      setMessage(
        error.response?.data?.message ||
          "Login gagal. Periksa email dan password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Secure UNSIA Digital Library</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;