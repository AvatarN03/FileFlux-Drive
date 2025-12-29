import { Upload } from "lucide-react";

const UploadArea = () => {
  return (
    <div className="flex flex-row md:flex-col gap-2 items-center justify-center text-center space-y-4 border-dashed border-2 p-4 rounded-md">
      <Upload className="w-8 md:w-12 h-8 md:h-12 text-ember" />
      <p className="font-semibold">
        Drag & drop or <span className="text-ember">browse</span>
      </p>
    </div>
  );
};

export default UploadArea;