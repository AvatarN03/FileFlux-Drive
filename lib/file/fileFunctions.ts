
export const formatFileSize = (bytes: number): string => {

  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};



export   const getFileExtension = (file:File) => {
    if (!file) return "";
    return file.name.slice(file.name.lastIndexOf("."));
  };