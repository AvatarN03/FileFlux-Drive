export const getReadableFileType = (type: string | null) => {
  if (!type) return "Unknown";

  if (type.includes("wordprocessingml")) return "Word Document";
  if (type.includes("spreadsheetml")) return "Excel Sheet";
  if (type.includes("presentationml")) return "PowerPoint";
  if (type.includes("pdf")) return "PDF Document";
  if (type.includes("image")) return "Image";
  if (type.includes("video")) return "Video";
  if (type.includes("audio")) return "Audio";
  if (type.includes("zip")) return "ZIP Archive";

  return "File";
};
