export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null &&
    error instanceof Error &&
    ('errno' in error && (typeof error.errno === "number" || typeof error.errno === "undefined")) &&
    ('code' in error && (typeof error.code === "string" || typeof error.code === "undefined")) &&
    ('path' in error && (typeof error.path === "string" || typeof error.path === "undefined")) &&
    ('syscall' in error && (typeof error.syscall === "string" || typeof error.syscall === "undefined"));
}