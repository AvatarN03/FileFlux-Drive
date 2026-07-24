import { PublicUser } from "@/types/auth";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../cloudinary";

export const getFileExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot === -1) return "";

  return fileName.slice(lastDot + 1).toLowerCase();
};

export const getFileNameWithoutExtension = (file: File | string): string => {
  const fileName = typeof file === "string" ? file : file.name;

  const lastDot = fileName.lastIndexOf(".");

  if (lastDot === -1) return fileName;

  return fileName.slice(0, lastDot);
};

export const createRenamedFile = (file: File, newName: string) => {
  const extension = getFileExtension(file.name);

  const finalName = extension ? `${newName}.${extension}` : newName;

  return new File([file], finalName, {
    type: file.type,
  });
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};


export const canUploadFile = (file: File, user: PublicUser): boolean => {
  const fileSize = file.size;
  const storageUsed = user.storageUsed;
  const storageLimit = user.storageLimit;

  return storageUsed + fileSize <= storageLimit;
}


