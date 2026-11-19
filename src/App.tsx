import { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { ExpenseList } from "./components/ExpenseList";
import { setUnauthorizedHandler } from "./api";
import { clearToken, getToken, saveToken } from "./auth";

function App() {
  const [token, setToken] = useState<string | null>(getToken());

  useEffect(() => {
    setUnauthorizedHandler(() => setToken(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  function handleLogin(newToken: string) {
    saveToken(newToken);
    setToken(newToken);
  }

  function handleLogout() {
    clearToken();
    setToken(null);
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <button onClick={handleLogout}>Вийти</button>
      <h1>Мої витрати</h1>
      <ExpenseList />
    </div>
  );
}

export default App;