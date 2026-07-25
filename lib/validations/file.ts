import { PublicUser } from "@/types/auth";

// file upload validation
export const canUploadFile = (file: File, user: PublicUser): boolean => {
  const fileSize = file.size;
  const storageUsed = user.storageUsed;
  const storageLimit = user.storageLimit;

  return storageUsed + fileSize <= storageLimit;
}
