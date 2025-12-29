import { cookies } from "next/headers";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { folders } from "@/db/schema";
import { FolderPathNode } from "@/types/file";
import { verifyToken } from "@/lib/validations/jwtServices";
import cloudinary from "@/lib/cloudinary";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("FP-accessToken");

  if (!tokenCookie?.value) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    return verifyToken(tokenCookie.value).value as { id: number };
  } catch {
    throw new Error("UNAUTHORIZED");
  }
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
