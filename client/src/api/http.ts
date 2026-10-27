const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface RequestOptions extends RequestInit {
  body?: BodyInit | null;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(payload.error || 'The request could not be completed.');
  }
  return payload as T;
}

