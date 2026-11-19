import { useState, type FormEvent } from "react";
import { updateExpense, type Expense } from "../api";
import { CATEGORIES, categoryLabel } from "../categories";

type Props = {
  expense: Expense;
  onUpdated: (expense: Expense) => void;
  onDelete: (id: number) => void;
};

export function ExpenseItem({ expense, onUpdated, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [error, setError] = useState("");

  function startEditing() {
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setError("");
    setEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const updated = await updateExpense(expense.id, {
        title,
        amount: Number(amount),
        category,
      });
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    }
  }

  if (!editing) {
    return (
      <li>
        {expense.title}: {expense.amount} ({categoryLabel(expense.category)}){" "}
        <button onClick={startEditing}>Редагувати</button>{" "}
        <button onClick={() => onDelete(expense.id)}>Видалити</button>
      </li>
    );
  }

  return (
    <li>
      <form onSubmit={handleSave}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {!CATEGORIES.some((c) => c.value === category) && (
            <option value={category}>{category}</option>
          )}
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit">Зберегти</button>
        <button type="button" onClick={() => setEditing(false)}>
          Скасувати
        </button>
        {error && <p>{error}</p>}
      </form>
    </li>
  );
}