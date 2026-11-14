import assert from "node:assert/strict";
import test from "node:test";

import { isOwnedVaultObjectKey } from "../lib/storage/authorization";

test("accepts a non-empty object key in the authenticated user's namespace", () => {
  assert.equal(
    isOwnedVaultObjectKey("vaults/user-a/file.enc", "user-a"),
    true,
  );
});

test("rejects an object key from another user's namespace", () => {
  assert.equal(
    isOwnedVaultObjectKey("vaults/user-b/file.enc", "user-a"),
    false,
  );
});

test("rejects namespace prefix collisions", () => {
  assert.equal(
    isOwnedVaultObjectKey("vaults/user-ab/file.enc", "user-a"),
    false,
  );
});

test("rejects the namespace itself and malformed object keys", () => {
  assert.equal(isOwnedVaultObjectKey("vaults/user-a/", "user-a"), false);
  assert.equal(isOwnedVaultObjectKey("user-a/file.enc", "user-a"), false);
  assert.equal(isOwnedVaultObjectKey("vaults//file.enc", "user-a"), false);
});
