import { useEffect, useState } from "react";
import {
  getSummary,
  UnauthorizedError,
  type Expense,
  type Summary as SummaryData,
} from "../api";
import { categoryLabel } from "../categories";

type Props = {
  token: string;
  expenses: Expense[];
  onUnauthorized: () => void;
};

export function Summary({ token, expenses, onUnauthorized }: Props) {
  const [month, setMonth] = useState("");
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getSummary(token, month)
      .then(setData)
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          onUnauthorized();
        } else {
          setError(err instanceof Error ? err.message : "Невідома помилка");
        }
      });
  }, [token, month, expenses, onUnauthorized]);

  return (
    <div>
      <h2>Підсумки</h2>
      <label>
        Місяць:{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>{" "}
      {month && <button onClick={() => setMonth("")}>За весь час</button>}

      {error && <p>{error}</p>}
      {data && (
        <>
          <p>Усього: {data.total}</p>
          <ul>
            {data.categories.map((c) => (
              <li key={c.category}>
                {categoryLabel(c.category)}: {c.total}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}