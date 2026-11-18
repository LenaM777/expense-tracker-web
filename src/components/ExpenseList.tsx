import { useEffect, useState } from "react";
import {
  deleteExpense,
  getExpenses,
  UnauthorizedError,
  type Expense,
} from "../api";
import { categoryLabel } from "../categories";
import { ExpenseForm } from "./ExpenseForm";

type Props = {
  token: string;
  onUnauthorized: () => void;
};

export function ExpenseList({ token, onUnauthorized }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExpenses(token)
      .then(setExpenses)
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          onUnauthorized();
        } else {
          setError(err instanceof Error ? err.message : "Невідома помилка");
        }
      })
      .finally(() => setLoading(false));
  }, [token, onUnauthorized]);

  async function handleDelete(id: number) {
    if (!window.confirm("Видалити цю витрату?")) return;
    setError("");

    try {
      await deleteExpense(token, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Невідома помилка");
    }
  }

  return (
    <div>
      <ExpenseForm
        token={token}
        onCreated={(expense) => setExpenses((prev) => [...prev, expense])}
        onUnauthorized={onUnauthorized}
      />

      {loading && <p>Завантаження...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && expenses.length === 0 && (
        <p>Витрат поки немає</p>
      )}

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.title}: {e.amount} ({categoryLabel(e.category)}){" "}
            <button onClick={() => handleDelete(e.id)}>Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
}