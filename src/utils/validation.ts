export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0;
}
