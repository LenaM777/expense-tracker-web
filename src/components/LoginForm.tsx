import { useState, type FormEvent } from "react";
import { login } from "../api";

type Props = {
  onLogin: (token: string) => void;
};

export function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = await login(email, password);
      onLogin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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