/**
 * Returns whether an object key belongs to the authenticated user's vault
 * namespace. The trailing separator prevents prefix-collision authorization.
 */
export function isOwnedVaultObjectKey(objectKey: string, userId: string): boolean {
  const prefix = `vaults/${userId}/`;
  return objectKey.startsWith(prefix) && objectKey.length > prefix.length;
}
