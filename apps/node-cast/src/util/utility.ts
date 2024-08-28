export const hasObject = (obj: unknown): boolean =>
  obj && typeof obj === 'object' && Boolean(Object.keys(obj).length);
