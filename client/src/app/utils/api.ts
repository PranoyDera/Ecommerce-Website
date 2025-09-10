const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost<T>(
  endpoint: string,
  body: Record<string, unknown>,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    // Throw error with backend message
    throw new Error(data.message || `POST ${endpoint} failed with status ${res.status}`);
  }

  return data as T;
}
