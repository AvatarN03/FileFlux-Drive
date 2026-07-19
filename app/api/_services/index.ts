import { cookies } from "next/headers";
import crypto from "node:crypto";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { folders, usersTable, verificationTokens } from "@/db/schema";

import { verifyToken } from "@/lib/validations/jwtServices";
import cloudinary from "@/lib/cloudinary";

import { FolderPathNode } from "@/types/file";

export async function verifyAuth(): Promise<{ id: string }> {
  const cookieStore = await cookies();

  const token = cookieStore.get("FP-accessToken")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const verified = verifyToken(token);

  if (!verified.valid || !verified.value) {
    throw new Error("UNAUTHORIZED");
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
    throw new Error("USER_NOT_FOUND");
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

export async function buildFolderPath(
  folderId: number,
  userId: number
): Promise<{ id: number; name: string }[]> {
  const path: { id: number; name: string }[] = [];
  let currentId: number | null = folderId;

  while (currentId !== null) {
    const folder: FolderPathNode | undefined = await db.query.folders.findFirst(
      {
        where: and(eq(folders.id, currentId), eq(folders.user_id, userId)),
        columns: {
          id: true,
          name: true,
          parentId: true,
        },
      }
    );

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return path;
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    if (result.result !== "ok") {
      throw new Error("Cloudinary deletion failed");
    }

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}


// utils/isTempEmail.ts

// utils/isTempEmail.ts


// utils/verifyEmail.ts
import emailValidator from "node-email-verifier";
import { publicUserSelect } from "@/db/selection";

export async function verifyEmailAddress(email: string) {
  try {
    const result = await emailValidator(email, {
      checkMx: true,          // check domain MX records
      checkDisposable: true,  // detect disposable mail providers
      timeout: "5s",          // optional DNS lookup timeout
      detailed: true          // get detailed validation info
    });

    /* result.valid is true/false;
       when detailed is true, result contains:
         - format.valid
         - mx.valid
         - disposable.valid
       etc. 
    */
    return result;
  } catch (err) {
    console.error("emailVerifier error:", err);
    // if fail on DNS etc., return a simple false status
    return { valid: false };
  }
}



export const MAX_STORAGE = 20 * 1024 * 1024;
