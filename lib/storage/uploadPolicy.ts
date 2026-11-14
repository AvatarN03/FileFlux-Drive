export const MAX_ENCRYPTED_FILE_BYTES = 50 * 1024 * 1024;

export type UploadSizeError = "invalid" | "too_large" | "quota_exceeded";

/**
 * Validate the size that will be stored, using server-owned quota values.
 */
export function getUploadSizeError(
  size: number,
  storageUsed: number,
  storageLimit: number,
): UploadSizeError | null {
  if (
    !Number.isSafeInteger(size) ||
    size <= 0 ||
    !Number.isSafeInteger(storageUsed) ||
    !Number.isSafeInteger(storageLimit) ||
    storageUsed < 0 ||
    storageLimit < 0
  ) {
    return "invalid";
  }

  if (size > MAX_ENCRYPTED_FILE_BYTES) {
    return "too_large";
  }

  if (size > Math.max(0, storageLimit - storageUsed)) {
    return "quota_exceeded";
  }

  return null;
}
