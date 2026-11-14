/**
 * Log only a stable server-side context and error class. Error messages and
 * serialized error objects may contain query parameters, object keys, or
 * other sensitive implementation details.
 */
export function logServerError(context: string, error: unknown): void {
  const errorType = error instanceof Error ? error.name : typeof error;
  console.error(`[FileFlux] ${context}`, errorType);
}
