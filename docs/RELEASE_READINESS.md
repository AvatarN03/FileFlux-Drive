# FileFlux Release Readiness

This checklist describes the release procedure for the current FileFlux v2
vault-encryption implementation. It is an operational guide, not proof that a
production environment is ready. The owner must complete the open gates before
deployment.

## Current release posture

- Client-side file-content encryption and encrypted file/folder metadata are
  implemented.
- The server receives ciphertext, encrypted metadata, wrapped file keys, and
  operational metadata only.
- The current storage adapter targets Neon S3-compatible Object Storage. The
  provider, account availability, pricing, terms, bucket privacy, and limits
  must still be confirmed in the actual deployment account.
- Phase 1 page-scope and final UI refinement work remains deferred.
- Distributed rate limiting and scheduled orphan-object sweeping are not
  implemented in this repository. They require shared deployment infrastructure
  and are release blockers for a public production launch.

## Required environment names

Configure these in the deployment platform's secret manager. Never commit
values or expose server-only values through `NEXT_PUBLIC_*` variables.

Server-only:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `NEON_STORAGE_ENDPOINT` (or the configured S3-compatible endpoint variable)
- `NEON_STORAGE_REGION`
- `NEON_STORAGE_ACCESS_KEY_ID`
- `NEON_STORAGE_SECRET_ACCESS_KEY`
- `NEON_STORAGE_BUCKET_NAME`
- `BREVO_API_KEY`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `GOOGLE_CLIENT_ID`

Browser-exposed configuration:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

The S3-compatible storage credentials, database URL, JWT secret, email API key,
and OAuth server credentials must never use a `NEXT_PUBLIC_` prefix.

## Pre-release gates

Run these checks from the exact release commit:

```bash
npm ci
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Before deployment, also verify:

- No `.env*` file, secret, recovery key, vault key, or passphrase is staged.
- The object-storage bucket is private and public object access is disabled.
- Presigned upload/download URLs are short-lived and scoped to one object.
- The production database is backed up and the restore procedure has been
  tested separately.
- The deployment platform's logs and error reporting do not collect request
  bodies, encrypted envelopes, object keys, or browser plaintext.
- Rate limiting is configured using a shared store or platform control.
- A scheduled cleanup process exists for abandoned ciphertext objects.
- The owner has reviewed the deferred Phase 1 pages and the current release
  scope.

## Database migration procedure

Migrations must be applied to a development/staging database first and checked
against the application build. Do not reset or drop a production database.

1. Back up the target database and record the backup identifier.
2. Run the migration against staging.
3. Run the focused application tests and smoke checks against staging.
4. Apply the same migration set to production through the approved deployment
   process.
5. Verify the migration ledger and encrypted folder metadata columns.
6. Keep the previous application artifact available until the smoke checks pass.

The encrypted-folder migration is additive. Rollback should normally be an
application rollback; do not remove encrypted metadata columns while any
deployed application may still read or write them.

## Deployment and smoke test sequence

1. Deploy the exact tested build with production secrets configured.
2. Confirm account login and email-verification behavior.
3. Enroll a test vault and confirm the recovery key is displayed only in the
   browser flow.
4. Unlock with the passphrase, lock, and unlock with the recovery key.
5. Upload a small test file and confirm the server/database contain ciphertext,
   encrypted metadata, and a wrapped file key only.
6. Download and decrypt the file in the browser.
7. Verify a modified or truncated ciphertext download is rejected.
8. Verify another authenticated user cannot authorize, list, move, download, or
   abort the first user's file/object.
9. Verify an oversized upload and a quota-exceeding upload are rejected before
   storage authorization.
10. Confirm vault locking removes decrypted file/folder query data from the
    client cache.

## Rollback procedure

1. Disable the rollout or route traffic to the last known-good application
   artifact.
2. Do not delete storage objects or database rows during an application
   rollback.
3. If a migration was applied, keep additive columns and use the compatible
   previous artifact; do not run a destructive down-migration automatically.
4. Revoke or rotate exposed deployment credentials if the incident involved
   secrets, logs, or a compromised runtime.
5. Preserve the incident timeline, deployment identifier, migration ledger
   state, and affected object/account identifiers without recording plaintext
   content or cryptographic secrets.
6. Re-run login, vault unlock/recovery, upload, download, authorization, and
   tamper-detection smoke checks before restoring traffic.

## Zero-knowledge limitations to disclose

- A malicious browser extension, malware, or compromised device can access
  plaintext while the vault is unlocked.
- A service operator controlling the JavaScript bundle could deploy code that
  captures secrets during unlock; browser-side encryption cannot prevent this.
- Object sizes, timestamps, access patterns, account identifiers, and traffic
  patterns remain observable metadata.
- Losing both the vault passphrase and recovery key makes encrypted content
  unrecoverable by design.
