import  useFileStore  from "@/context/useFileStore";

const useStorage = () => {
  const storage = useFileStore((state) => state.storage);
  const checkStorage = useFileStore((state) => state.checkStorage);

  return {
    storage,
    checkStorage,
  };
};

export default useStorage;