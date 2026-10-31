"use client";

import FilesView from "../../_components/FilesView";
import { FileModalProvider } from "@/context/FileModalContext";

const FilesPage = () => (
  <FileModalProvider>
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      <FilesView key="root" folderId={null} title="Encrypted Files Repository" />
    </div>
  </FileModalProvider>
);

export default FilesPage;
