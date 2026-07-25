import { FileCategoryFilter, FileItem } from "@/types/file";

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

export const getFileCategoryFilter = (file: FileItem): FileCategoryFilter => {
  if (file.mimeType.startsWith("image/")) return "image";
  if (file.mimeType.startsWith("video/")) return "video";

  const ext = file.extension.toLowerCase();
  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (["doc", "docx", "pdf", "txt"].includes(ext)) return "document";

  return "other";
};