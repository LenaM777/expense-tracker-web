const API_URL = "http://localhost:3000";

export type User = {
  id: number;
  email: string;
};

export type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
};

export type NewExpense = {
  title: string;
  amount: number;
  category: string;
};

export type Summary = {
  total: number;
  categories: { category: string; total: number }[];
};

export class UnauthorizedError extends Error {}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401 && auth) {
    unauthorizedHandler?.();
    throw new UnauthorizedError("Сесія закінчилась");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message ?? "Помилка сервера");
  }

  return data as T;
}

export function login(email: string, password: string): Promise<User> {
  return request<User>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function logout(): Promise<void> {
  return request<void>("/auth/logout", { method: "POST", auth: false });
}

export function getMe(): Promise<User> {
  return request<User>("/auth/me", { auth: false });
}

export function getExpenses(): Promise<Expense[]> {
  return request<Expense[]>("/expenses");
}

export function createExpense(expense: NewExpense): Promise<Expense> {
  return request<Expense>("/expenses", { method: "POST", body: expense });
}

export function updateExpense(
  id: number,
  expense: NewExpense
): Promise<Expense> {
  return request<Expense>(`/expenses/${id}`, { method: "PUT", body: expense });
}

export function deleteExpense(id: number): Promise<void> {
  return request<void>(`/expenses/${id}`, { method: "DELETE" });
}

export function getSummary(month: string): Promise<Summary> {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  return request<Summary>(`/expenses/summary${query}`);
}