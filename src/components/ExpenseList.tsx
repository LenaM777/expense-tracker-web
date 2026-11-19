import { useEffect, useState } from "react";
import { deleteExpense, getExpenses, type Expense } from "../api";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseItem } from "./ExpenseItem";
import { Summary } from "./Summary";

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Невідома помилка")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Видалити цю витрату?")) return;
    setError("");

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    }
  }

  return (
    <div>
      <Summary expenses={expenses} />

      <ExpenseForm
        onCreated={(expense) => setExpenses((prev) => [...prev, expense])}
      />

      {loading && <p>Завантаження...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && expenses.length === 0 && (
        <p>Витрат поки немає</p>
      )}

      <ul>
        {expenses.map((e) => (
          <ExpenseItem
            key={e.id}
            expense={e}
            onUpdated={(updated) =>
              setExpenses((prev) =>
                prev.map((x) => (x.id === updated.id ? updated : x))
              )
            }
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}