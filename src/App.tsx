import { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { ExpenseList } from "./components/ExpenseList";
import { getMe, logout, setUnauthorizedHandler, type User } from "./api";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false));

    return () => setUnauthorizedHandler(null);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }

  if (checking) {
    return <p>Завантаження...</p>;
  }

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <div>
      <p>{user.email}</p>
      <button onClick={handleLogout}>Вийти</button>
      <h1>Мої витрати</h1>
      <ExpenseList />
    </div>
  );
}

export default App;