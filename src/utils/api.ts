const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!rawApiBaseUrl) {
    return normalizedPath;
  }

  const base = rawApiBaseUrl.replace(/\/+$/, '');
  return `${base}${normalizedPath}`;
}
