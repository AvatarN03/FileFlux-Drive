import crypto from "node:crypto";

import { cookies } from "next/headers";

import {eq } from "drizzle-orm";
import { UploadApiResponse } from "cloudinary";

import { verifyToken } from "./jwtServices";

import { db } from "@/db";
import {  usersTable, verificationTokens } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";

import cloudinary from "@/lib/cloudinary";

// auth 
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


