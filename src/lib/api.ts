import { auth } from '@/auth.config';

const API_URL = process.env.API_URL!;

// Cliente para Server Actions / Server Components (incluye el JWT de NestJS)
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const session = await auth();
  const backendToken = (session?.user as any)?.token as string | undefined;

const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
    ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {}),
  };

  return fetch(`${API_URL}${path}`, { ...options, headers });
}

// Helper para GET con JSON
export async function apiGet<T>(path: string): Promise<T> {
  const resp = await apiFetch(path);
  if (!resp.ok) throw new Error(`GET ${path} → ${resp.status}`);
  return resp.json();
}

// Helper para POST con JSON
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const resp = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`POST ${path} → ${resp.status}`);
  return resp.json();
}

// Helper para PATCH con JSON
export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const resp = await apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`PATCH ${path} → ${resp.status}`);
  return resp.json();
}

// Helper para DELETE
export async function apiDelete<T>(path: string): Promise<T> {
  const resp = await apiFetch(path, { method: 'DELETE' });
  if (!resp.ok) throw new Error(`DELETE ${path} → ${resp.status}`);
  return resp.json();
}
