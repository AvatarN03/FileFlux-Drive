"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import  useFileStore from "@/context/useFileStore";

const Storage = () => {
  const { storage, checkStorage } = useFileStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const StorageHandle = async () => {
      await checkStorage();
      setIsLoading(false);
    };
    StorageHandle();
  }, [checkStorage]);
  if (!storage) return null;

  const percent = (storage.used / storage.max) * 100;

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="max-w-92 mx-auto w-full rounded-xl p-2 md:p-3 bg-ember">
      <div className="w-full h-full rounded-xl p-3 bg-peach flex flex-col gap-4">
        <h1 className="text-violet text-center text-xl md:text-2xl my-2 font-medium border-b-violet border-b-2 max-w-64 w-full shadow-xl mx-auto">
          Storage
        </h1>

        <div className="flex flex-col w-full gap-2 items-center justify-center">
          <h2 className="text-xl font-bold text-violet">
            {(storage.used / (1024 * 1024)).toFixed(1)} MB /{" "}
            {(storage.max / (1024 * 1024)).toFixed(0)} MB
          </h2>

          <div className="h-2 max-w-68 w-full bg-brown rounded-full relative overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className="h-full bg-ember rounded-full transition-all absolute"
            />
          </div>

          <h6 className="text-ember font-semibold my-2 md:my-4">
            Available storage: {(storage.remaining / (1024 * 1024)).toFixed(1)}{" "}
            MB
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Storage;
