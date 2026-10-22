"use client";

import { useMemo, useState } from "react";

import { Error } from "./Error";
import FileHeader from "./FileHeader";
import FileLists from "./FileLists";
import FilePreviewModal from "./FilePreviewModel";
import FileDetailsModal from "./FileDetailModel";
import FileEditModal from "./FileEditModel";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFiles } from "@/hooks/useFileQueries";

import { useFileModal } from "@/context/FileModalContext";

import { FileCategoryFilter } from "@/types/file";

interface FilesViewProps {
    folderId: string | null;
    title: string;
}

const FilesView = ({ folderId, title }: FilesViewProps) => {
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState<FileCategoryFilter>("all");

    const debouncedSearch = useDebouncedValue(searchInput, 500);

    const { data, isLoading, isFetching, isRefetching, refetch, isError } = useFiles({
        folderId,
        search: debouncedSearch,
        category,
    });

    const { mode, file: modalFile, closeModal } = useFileModal();

    const files = useMemo(() => data ?? [], [data]);

    if (isError) {
        return <Error
            isRefetching={isRefetching}
            handleRetry={refetch}
            text="Failed to load files. Please try again later."
        />;
    }

    return (
        <div className="mb-10 space-y-4">            
            <FileHeader
                title={title}
                isFetching={isFetching && !isLoading}
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                category={category}
                onCategoryChange={setCategory}
            />

            <FileLists
                data={files}
                isLoading={isLoading}
                isFetching={isFetching}
            />

            {mode === "preview" && modalFile && <FilePreviewModal file={modalFile} onClose={closeModal} />}
            {mode === "details" && modalFile && <FileDetailsModal file={modalFile} onClose={closeModal} />}
            {mode === "edit" && modalFile && <FileEditModal file={modalFile} onClose={closeModal} />}
        </div>
    );
};

export default FilesView;