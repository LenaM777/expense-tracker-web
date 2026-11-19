const API_URL = "http://localhost:3000";

export async function login(email: string, password: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.token;
}

export type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
};

export class UnauthorizedError extends Error {}

export async function getExpenses(token: string): Promise<Expense[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401) {
    throw new UnauthorizedError("Сесія закінчилась");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export type NewExpense = {
  title: string;
  amount: number;
  category: string;
};

export async function createExpense(
  token: string,
  expense: NewExpense
): Promise<Expense> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401) {
    throw new UnauthorizedError("Сесія закінчилась");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteExpense(token: string, id: number): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401) {
    throw new UnauthorizedError("Сесія закінчилась");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
}

export async function updateExpense(
  token: string,
  id: number,
  expense: NewExpense
): Promise<Expense> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401) {
    throw new UnauthorizedError("Сесія закінчилась");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}