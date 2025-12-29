import  useFileStore  from "@/context/useFileStore";

const useFiles = () => {
  const files = useFileStore((state) => state.files);
  const loading = useFileStore((state) => state.loading);
  const fetchFiles = useFileStore((state) => state.fetchFiles);
  const deleteFile = useFileStore((state) => state.deleteFile);
  const renameFile = useFileStore((state) => state.renameFile);
  const moveFile = useFileStore((state) => state.moveFile);

  return {
    files,
    loading,
    fetchFiles,
    deleteFile,
    renameFile,
    moveFile,
  };
};

export default useFiles;