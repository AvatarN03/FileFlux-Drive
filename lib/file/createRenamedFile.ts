import { getFileExtension } from "./fileFunctions";

const createRenamedFile = (file: File, newName: string): File => {
  const extension = getFileExtension(file);
  const finalName = newName + extension;
  return new File([file], finalName, { type: file.type });
};

export default createRenamedFile;