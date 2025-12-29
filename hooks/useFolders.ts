import  useFileStore  from "@/context/useFileStore";

const useFolders = () => {
  const folders = useFileStore((state) => state.folders);
  const loading = useFileStore((state) => state.loading);
  const fetchFolders = useFileStore((state) => state.fetchFolders);
  const addFolder = useFileStore((state) => state.addFolder);
  const updateFolder = useFileStore((state) => state.updateFolder);
  const deleteFolder = useFileStore((state) => state.deleteFolder);
  const moveFolder = useFileStore((state) => state.moveFolder);
  const getAllFolders = useFileStore((state) => state.getAllFolders);

  return {
    folders,
    loading,
    fetchFolders,
    addFolder,
    updateFolder,
    deleteFolder,
    moveFolder,
    getAllFolders,
  };
};

export default useFolders;