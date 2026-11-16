import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { ExpenseList } from "./components/ExpenseList";
import { clearToken, getToken, saveToken } from "./auth";


function App() {
  const [token, setToken] = useState<string | null>(getToken());

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
      <ExpenseList token={token} onUnauthorized={handleLogout} />
    </div>
  );
}

export default App;