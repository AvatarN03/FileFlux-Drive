import crypto from "node:crypto";

import { cookies } from "next/headers";

import { and, eq, isNull } from "drizzle-orm";
import { UploadApiResponse } from "cloudinary";

import { verifyToken } from "./jwtServices";

import { db } from "@/db";
import { folders, usersTable, verificationTokens } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";

import cloudinary from "@/lib/cloudinary";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return (
    error instanceof AuthError ||
    (error instanceof Error &&
      (error.name === "AuthError" ||
        error.message === "UNAUTHORIZED" ||
        error.message === "USER_NOT_FOUND" ||
        error.message === "Unauthorized"))
  );
}

// auth
export async function verifyAuth(): Promise<{ id: string }> {
  const cookieStore = await cookies();

  const token = cookieStore.get("FP-accessToken")?.value;

  if (!token) {
    throw new AuthError("Unauthorized");
  }

  const verified = verifyToken(token);

  if (!verified.valid || !verified.value) {
    throw new AuthError("Unauthorized");
  }

  return verified.value as { id: string };
}

export async function getAuthUser() {
  const { id } = await verifyAuth();

  const [user] = await db
    .select(publicUserSelect)
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    throw new AuthError("User not found");
  }

  return user;
}

export async function generateEmailVerification(userId: string) {
  // Random secure token
  const token = crypto.randomBytes(32).toString("hex");

  // Expires in 24 hours
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  // Remove any previous unexpired verification tokens
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, userId));

  // Save new token
  await db.insert(verificationTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// ---

// file

export function getThumbnailUrl(
  upload: UploadApiResponse
): string | null {
  // Images
  if (upload.resource_type === "image") {
    return cloudinary.url(upload.public_id, {
      transformation: [
        {
          width: 300,
          height: 300,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });
  }

  // Videos
  if (upload.resource_type === "video") {
    return cloudinary.url(upload.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        {
          width: 300,
          height: 300,
          crop: "fill",
        },
      ],
    });
  }

  // PDFs
  if (upload.format?.toLowerCase() === "pdf") {
    return cloudinary.url(upload.public_id, {
      resource_type: "image",
      format: "jpg",
      page: 1,
      transformation: [
        {
          width: 300,
          height: 300,
          crop: "fill",
        },
      ],
    });
  }

  return null;
}



// TODO: came back to delete in cron job
// export async function deleteFromCloudinary(publicId: string) {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: "raw",
//     });

//     if (result.result !== "ok") {
//       throw new Error("Cloudinary deletion failed");
//     }

//     return result;
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw error;
//   }
// }

export async function buildFolderPath(
  folderId: string,
  userId: string
): Promise<{ id: string; name: string }[]> {
  const path: { id: string; name: string }[] = [];
  const visited = new Set<string>();
  let currentId: string | null = folderId;

  while (currentId !== null && !visited.has(currentId) && visited.size < 50) {
    visited.add(currentId);

    const [folder] = await db
      .select({
        id: folders.id,
        name: folders.name,
        parentId: folders.parentId,
      })
      .from(folders)
      .where(
        and(
          eq(folders.id, currentId),
          eq(folders.userId, userId),
          isNull(folders.deletedAt)
        )
      );

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return path;
}
