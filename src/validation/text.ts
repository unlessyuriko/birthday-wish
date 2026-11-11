/** The forbidden long dash, written as an escape so this file never contains it literally. */
export const FORBIDDEN_DASH = '\u2014';
const DASH_RE = new RegExp('\\s*' + FORBIDDEN_DASH + '\\s*', 'g');

export function stripForbiddenDash(text: string): string {
  return text.replace(DASH_RE, ' - ');
}

export function hasForbiddenDash(text: string): boolean {
  return text.includes(FORBIDDEN_DASH);
}

/** Deep-map every string in a value through stripForbiddenDash. */
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') return stripForbiddenDash(value) as unknown as T;
  if (Array.isArray(value)) return value.map(sanitizeDeep) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = sanitizeDeep(v);
    return out as T;
  }
  return value;
}

export function collectStrings(value: unknown, path = '', out: Array<[string, string]> = []): Array<[string, string]> {
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) collectStrings(v, path ? `${path}.${k}` : k, out);
  return out;
}
