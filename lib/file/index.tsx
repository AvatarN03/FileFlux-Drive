import { ReactNode } from "react";
import {
  Image as ImageIcon,
  FileText,
  File,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";

// file size
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getReadableFileType = (type: string | null | undefined): string => {
  if (!type) return "Unknown";

  const lower = type.toLowerCase();
  if (lower.includes("wordprocessingml") || lower.includes("doc")) return "Word Document";
  if (lower.includes("spreadsheetml") || lower.includes("xls") || lower.includes("sheet")) return "Excel Sheet";
  if (lower.includes("presentationml") || lower.includes("ppt")) return "PowerPoint";
  if (lower.includes("pdf")) return "PDF Document";
  if (lower.includes("image")) return "Image";
  if (lower.includes("video")) return "Video";
  if (lower.includes("audio")) return "Audio";
  if (lower.includes("zip") || lower.includes("archive") || lower.includes("tar") || lower.includes("rar")) return "ZIP Archive";

  return "File";
};

export const getFileIcon = (type: string | null | undefined): ReactNode => {
  if (!type) {
    return <File size={32} />;
  }

  const lowerType = type.toLowerCase();

  if (lowerType.startsWith("image/")) {
    return <ImageIcon size={32} />;
  }

  if (
    lowerType.includes("video") ||
    lowerType.includes("mp4") ||
    lowerType.includes("mpeg") ||
    lowerType.includes("mkv")
  ) {
    return <FileVideo size={32} />;
  }

  if (
    lowerType.includes("audio") ||
    lowerType.includes("mp3") ||
    lowerType.includes("wav")
  ) {
    return <FileAudio size={32} />;
  }

  if (lowerType.includes("pdf")) {
    return <FileText size={32} />;
  }

  if (
    lowerType.includes("xls") ||
    lowerType.includes("xlsx") ||
    lowerType.includes("csv")
  ) {
    return <FileSpreadsheet size={32} />;
  }

  if (
    lowerType.includes("doc") ||
    lowerType.includes("docx") ||
    lowerType.includes("txt")
  ) {
    return <FileText size={32} />;
  }

  if (
    lowerType.includes("zip") ||
    lowerType.includes("rar") ||
    lowerType.includes("7z")
  ) {
    return <FileArchive size={32} />;
  }

  if (
    lowerType.includes("js") ||
    lowerType.includes("ts") ||
    lowerType.includes("json")
  ) {
    return <FileCode size={32} />;
  }

  return <File size={32} />;
};
