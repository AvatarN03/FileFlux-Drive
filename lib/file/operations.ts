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
  const mimeType = file.mimeType.toLowerCase();
  const ext = file.extension.toLowerCase().replace(/^\./, "");

  if (mimeType === "application/pdf" || ext === "pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";

  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (["doc", "docx", "txt"].includes(ext)) return "document";

  return "other";
};
