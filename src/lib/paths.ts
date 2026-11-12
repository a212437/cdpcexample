const base = import.meta.env.BASE_URL;
const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${normalizedBase}${path}`;
}

export function stripBase(pathname: string): string {
  if (!normalizedBase) return pathname;
  if (pathname === normalizedBase) return '/';
  if (pathname.startsWith(`${normalizedBase}/`)) {
    return pathname.slice(normalizedBase.length);
  }
  return pathname;
}
