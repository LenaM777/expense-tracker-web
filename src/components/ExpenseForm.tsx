import { useState, type FormEvent } from "react";
import { createExpense, UnauthorizedError, type Expense } from "../api";

type Props = {
  token: string;
  onCreated: (expense: Expense) => void;
  onUnauthorized: () => void;
};

export function ExpenseForm({ token, onCreated, onUnauthorized }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
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
      setCategory("");
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
      <input
        placeholder="Категорія"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Додати</button>
      {error && <p>{error}</p>}
    </form>
  );
}