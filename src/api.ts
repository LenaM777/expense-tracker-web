import { clearToken, getToken } from "./auth";

const API_URL = "http://localhost:3000";

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
  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Сервер недоступний");
  }

  if (res.status === 401 && auth) {
    clearToken();
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

export async function login(email: string, password: string): Promise<string> {
  const data = await request<{ token: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  return data.token;
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