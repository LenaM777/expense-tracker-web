import { useEffect, useState } from "react";
import { getSummary, type Expense, type Summary as SummaryData } from "../api";
import { categoryLabel } from "../categories";

type Props = {
  expenses: Expense[];
};

export function Summary({ expenses }: Props) {
  const [month, setMonth] = useState("");
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getSummary(month)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Невідома помилка")
      );
  }, [month, expenses]);

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