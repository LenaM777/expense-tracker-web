import { useState, type FormEvent } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch {
      setError("Сервер недоступний");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  if (token) {
    return (
      <div>
        <p>Ви увійшли</p>
        <button onClick={handleLogout}>Вийти</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Вхід</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Увійти</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default App;