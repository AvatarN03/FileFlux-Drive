"use client";

import FilesView from "../../_components/FilesView";

import { FileModalProvider } from "@/context/FileModalContext";

const FilesPage = () => (
  <FileModalProvider>
    <div className="p-2 md:p-4 lg:p-6">
      <FilesView
        key="root"
        folderId={null}
        title="All Files"
      />
    </div>
  </FileModalProvider>

);

export default FilesPage;