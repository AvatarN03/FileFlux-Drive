import { JSX } from "react";
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

export const getFileIcon = (type: string | null): JSX.Element => {
  if (!type) {
    return <File size={32} />; // fallback if null
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
