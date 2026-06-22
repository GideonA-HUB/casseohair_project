export function getAdminToken(): string | null {
  return localStorage.getItem('access_token');
}

export function unwrapList<T>(data: T[] | { results?: T[] }): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function adminFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.detail || body.message || JSON.stringify(body);
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function adminFetchList<T>(url: string): Promise<T[]> {
  const data = await adminFetch<T[] | { results?: T[] }>(url);
  return unwrapList(data);
}

export function formatNaira(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `₦${(num || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}
