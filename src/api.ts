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