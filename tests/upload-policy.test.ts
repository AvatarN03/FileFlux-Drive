import assert from "node:assert/strict";
import test from "node:test";

import {
  getUploadSizeError,
  MAX_ENCRYPTED_FILE_BYTES,
} from "../lib/storage/uploadPolicy";

test("accepts a valid upload within the server quota", () => {
  assert.equal(getUploadSizeError(1024, 2048, 4096), null);
});

test("rejects invalid upload sizes", () => {
  assert.equal(getUploadSizeError(0, 0, 4096), "invalid");
  assert.equal(getUploadSizeError(Number.NaN, 0, 4096), "invalid");
  assert.equal(getUploadSizeError(-1, 0, 4096), "invalid");
  assert.equal(getUploadSizeError(1024.5, 0, 4096), "invalid");
});

test("rejects uploads above the encrypted-file ceiling", () => {
  assert.equal(
    getUploadSizeError(MAX_ENCRYPTED_FILE_BYTES + 1, 0, MAX_ENCRYPTED_FILE_BYTES + 1),
    "too_large",
  );
});

test("rejects uploads that exceed the remaining server quota", () => {
  assert.equal(getUploadSizeError(2049, 2048, 4096), "quota_exceeded");
});
