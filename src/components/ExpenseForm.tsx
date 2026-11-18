import { useState, type FormEvent } from "react";
import { createExpense, UnauthorizedError, type Expense } from "../api";
import { CATEGORIES } from "../categories";

type Props = {
  token: string;
  onCreated: (expense: Expense) => void;
  onUnauthorized: () => void;
};

export function ExpenseForm({ token, onCreated, onUnauthorized }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const expense = await createExpense(token, {
        title,
        amount: Number(amount),
        category,
      });
      onCreated(expense);
      setTitle("");
      setAmount("");
      setCategory(CATEGORIES[0].value);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Невідома помилка");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Назва"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Сума"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
  {CATEGORIES.map((c) => (
    <option key={c.value} value={c.value}>
      {c.label}
    </option>
  ))}
</select>
      <button type="submit">Додати</button>
      {error && <p>{error}</p>}
    </form>
  );
}