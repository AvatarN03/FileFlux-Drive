import { AddFolderModalProps } from "@/types/ui";


const AddFolderModal =  ({
  value,
  onChange,
  onAdd,
  onClose,
  onKeyPress,
}: AddFolderModalProps) => {
  return (
    <div
      className="w-screen  h-screen fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="max-w-xl w-full mx-4 rounded-2xl bg-peach text-ember p-6 min-h-64 flex flex-col justify-between shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-2xl font-semibold text-violet">Add New Folder</h2>
          <p className="text-sm mt-1">Create a folder to organize your files</p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium text-ember">Folder Name</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="Enter folder name..."
              className="w-full px-4 py-2 rounded-lg border border-ember 
               focus:outline-none focus:ring-2 text-violet font-bold focus:ring-violet
               placeholder:text-ember/60"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border cursor-pointer border-brown/70 
             hover:bg-brown/30 transition"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onAdd}
              className="px-5 py-2 rounded-lg bg-violet cursor-pointer text-peach
             font-medium hover:opacity-90 transition"
            >
              Add Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;