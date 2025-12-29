const getFileNameWithoutExtension = (file: File): string => {
  return file.name.replace(/\.[^/.]+$/, "");
};

export default getFileNameWithoutExtension;