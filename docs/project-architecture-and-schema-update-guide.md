# FileFlux Project Architecture and Schema Update Guide

This guide explains how FileFlux is wired end to end and what must be updated when the database schema changes.

## How The Project Works

FileFlux is a Next.js App Router application with three main layers:

1. Route and layout composition in `app/`
2. Client state, handlers, and UI components in `context/`, `hooks/`, and `app/(main)/_components/`
3. Data access and persistence through `app/api/`, `db/`, and `drizzle/`

The root app experience starts in `app/layout.tsx` and `app/page.tsx`. Authenticated file-management views live under `app/(main)/`, while the auth screens live under `app/auth/`.

### Runtime Flow

1. `app/(main)/layout.tsx` checks authentication with `useAuthStore`.
2. When the user is signed in, the layout renders the file toolbar, storage widget, and the active page.
3. `app/(main)/dashboard/page.tsx` composes the dashboard by rendering `Folders` and `FileLists`.
4. The feature components call hooks such as `useFileHandlers` and `useFolderHandlers` for user actions.
5. Those hooks call the Zustand store in `context/useFileStore.ts`.
6. The store talks to the Next.js API routes under `app/api/`.
7. The API routes query Drizzle tables from `db/schema.ts` through `db/index.ts`.
8. Drizzle migrations are driven from `drizzle.config.ts`.

## File Connection Map

### Schema And Persistence

- `db/schema.ts` defines the canonical tables, columns, indexes, and relations.
- `db/index.ts` creates the Drizzle database instance used by API routes.
- `drizzle.config.ts` points Drizzle Kit at the schema and migration output.

### API Layer

- `app/api/files/route.ts` handles file rename and delete operations.
- `app/api/files/getFiles/route.ts` returns file lists and folder paths.
- `app/api/files/move/route.ts` updates file location.
- `app/api/files/upload/route.ts` creates file records after upload.
- `app/api/files/checkStorage/route.ts` reports storage usage.
- `app/api/folders/route.ts` handles folder create, read, update, delete.
- `app/api/folders/getAll/route.ts` returns all folders for move dialogs and tree views.
- `app/api/folders/path/route.ts` resolves folder ancestry.
- `app/api/auth/*/route.ts` manages login, signup, logout, protected-session checks, and account deletion.

### Client State And Hooks

- `context/useFileStore.ts` is the main client-side orchestration layer.
- `hooks/useFileHandlers.ts` handles file rename, delete, download, preview, and move actions.
- `hooks/useFolderHandlers.ts` handles folder create, rename, delete, and move actions.
- `hooks/useFile.ts`, `hooks/useFolders.ts`, `hooks/useStorage.ts`, and the other hooks wrap store access for feature components.

### UI Composition

- `app/(main)/layout.tsx` provides the authenticated shell, navigation, file upload area, and storage sidebar.
- `app/(main)/dashboard/page.tsx` is the main landing page after login.
- `app/(main)/files/page.tsx` and `app/(main)/folders/page.tsx` render the list views.
- `app/(main)/folders/[folderId]/page.tsx` renders nested folder browsing.
- `app/(main)/_components/` contains the visible table, card, and menu components used by the page routes.

### Shared Types And Utilities

- `types/file.ts` defines shared file and folder shapes used by the store and UI.
- `types/ui.ts` holds props and handler argument types.
- `lib/file/*` contains filename, icon, error, and file-type helpers.
- `lib/queryParams.ts` builds query strings for API requests.
- `lib/toast.ts` centralizes notifications.

## What Depends On The Schema

`db/schema.ts` is the source of truth, but several layers depend on the current field names and relations.

- API routes read and write table columns directly.
- `context/useFileStore.ts` expects API payloads to return file and folder objects in the shapes used by the UI.
- `hooks/useFileHandlers.ts` and `hooks/useFolderHandlers.ts` depend on file and folder field names when renaming, moving, previewing, and filtering items.
- `types/file.ts` bridges the Drizzle models with UI-specific response shapes such as `fileCount`, `totalSize`, and `path`.
- `app/(main)/layout.tsx` and the dashboard pages depend on the store actions working together without shape mismatches.

## Schema Change Update Guide

When `db/schema.ts` changes, treat it as a cross-layer change, not just a migration.

### Required Update Sequence

1. Update the schema in `db/schema.ts`.
2. Generate or apply the matching Drizzle migration.
3. Update the SQL and Drizzle queries in the affected API routes.
4. Update any response shaping in the routes so the client still receives the fields it expects.
5. Update `types/file.ts` and any related shared types.
6. Update the Zustand store in `context/useFileStore.ts` if request or response payloads changed.
7. Update `hooks/useFileHandlers.ts` and `hooks/useFolderHandlers.ts` if they reference renamed fields or new behavior.
8. Update the UI components under `app/(main)/_components/` if labels, sort order, paths, or metadata display change.
9. Validate the flows that create, rename, move, delete, upload, and preview files and folders.

### Files To Review For Common Schema Changes

- Table or column rename: review `db/schema.ts`, all matching API routes, and every place that constructs payloads.
- Relation change: review folder tree logic in `app/api/folders/route.ts`, `app/api/folders/getAll/route.ts`, `hooks/useFolderHandlers.ts`, and `context/useFileStore.ts`.
- File metadata change: review `app/api/files/route.ts`, `app/api/files/getFiles/route.ts`, `hooks/useFileHandlers.ts`, and `types/file.ts`.
- Storage or ownership change: review `app/api/files/checkStorage/route.ts`, `app/api/auth/*/route.ts`, and `app/(main)/layout.tsx`.

### Current Naming Mismatch To Watch

The codebase already has a naming split between the Drizzle schema and some consumer code.

- `db/schema.ts` uses camelCase field names in the TypeScript layer, with database column names mapped separately.
- Several API and store paths still refer to snake_case payload keys such as `file_name`, `file_url`, `public_id`, `file_size`, and `user_id`.
- Do not assume a schema edit automatically works everywhere; verify the request payload, response payload, and UI field names together.

This is the main reason schema changes in FileFlux need coordinated updates across the whole stack.

## Maintenance Checklist

Use this checklist after any schema change.

- Confirm the migration matches the new schema.
- Confirm the API routes still compile and return the expected JSON shape.
- Confirm the store can still fetch, update, and cache files and folders.
- Confirm rename and move flows still work from the UI.
- Confirm the dashboard, files page, and folder page still render the right records.
- Confirm storage calculations still match the updated table fields.
- Confirm any folder tree or path-building logic still respects the new relations.

## Recommended Workflow For Future Changes

1. Change the schema first.
2. Update the route layer next.
3. Update shared types and store actions.
4. Update hooks and UI labels last.
5. Run the app and test a full file lifecycle: upload, rename, move, preview, and delete.

## Notes

If you add new columns or relations, keep the schema change guide updated so future maintainers know which routes, hooks, and components must move together.