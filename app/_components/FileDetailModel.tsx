"use client";

import { FileItem } from "@/types/file";
import { formatFileSize } from "@/lib/file";
import FileModal from "./FileModal";
import { useFile } from "@/hooks/useFileQueries";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-2 border-b border-brown/10 last:border-0">
    <span className="text-violet/60 text-sm">{label}</span>
    <span className="text-violet text-sm font-medium text-right">{value}</span>
  </div>
);

const FileDetailsModal = ({ file, onClose }: { file: FileItem; onClose: () => void }) => {
  // Show list data immediately, replace with full record once it loads.
  const { data: details, isLoading } = useFile(file.id);
  const record = details ?? file;

  return (
    <FileModal title="File Details" onClose={onClose}>
      <div className="space-y-1">
        <Row label="Name" value={`${record.name}.${record.extension}`} />
        <Row label="Type" value={record.mimeType} />
        <Row label="Size" value={formatFileSize(record.size)} />
        <Row label="Folder" value={record.folder ? record.folder.name : "No folder (root)"} />
        <Row label="Favorite" value={record.isFavorite ? "Yes" : "No"} />
        <Row label="Created" value={formatDate(record.createdAt)} />
        {record.downloads !== undefined && (
          <Row label="Downloads" value={record.downloads} />
        )}
        {record.views !== undefined && (
          <Row label="Views" value={record.views} />
        )}
        {record.lastOpenedAt && (
          <Row label="Last opened" value={formatDate(record.lastOpenedAt)} />
        )}
      </div>
      {isLoading && (
        <p className="text-xs text-violet/40 mt-3">Loading full details…</p>
      )}
    </FileModal>
  );
};

export default FileDetailsModal;