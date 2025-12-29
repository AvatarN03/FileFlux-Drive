const FolderTableHeader = () => {
  return (
    <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-3 border-b-2 border-brown">
      <div className="col-span-4 text-brown font-semibold">Folder Name</div>
      <div className="col-span-2 text-brown font-semibold">Files</div>
      <div className="col-span-2 text-brown font-semibold">Size</div>
      <div className="col-span-4 text-brown font-semibold text-right">Actions</div>
    </div>
  );
};

export default FolderTableHeader;