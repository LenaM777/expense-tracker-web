import { useEffect, useState } from "react";
import { getExpenses, UnauthorizedError, type Expense } from "../api";

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

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;
  if (expenses.length === 0) return <p>Витрат поки немає</p>;

  return (
    <ul>
      {expenses.map((e) => (
        <li key={e.id}>
          {e.title}: {e.amount} ({e.category})
        </li>
      ))}
    </ul>
  );
}