import Link from "next/link";

const FileListHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl text-brown">Files</h1>
      <Link href={"/files"} className="hover:underline text-sm md:text-base">
        View all
      </Link>
    </div>
  );
};

export default FileListHeader;