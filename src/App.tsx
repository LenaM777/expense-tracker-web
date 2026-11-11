import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
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
      <p>Ви увійшли</p>
      <button onClick={handleLogout}>Вийти</button>
    </div>
  );
}

export default App;