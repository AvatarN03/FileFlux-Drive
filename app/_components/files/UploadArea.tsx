import { UploadCloud } from "lucide-react";

const UploadArea = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 py-6 w-full">
      <div className="w-12 h-12 bg-brand-cream-muted border-2 border-brand-brown text-brand-brown flex items-center justify-center mb-3 shadow-brown-2">
        <UploadCloud className="w-6 h-6" />
      </div>
      <p className="text-xs font-bold text-brand-violet">
        Drag & drop or <span className="text-brand-brown underline underline-offset-2">browse file</span>
      </p>
      <p className="text-[10px] text-brand-violet/70 mt-1 font-mono">
        Automatic client-side authenticated encryption
      </p>
    </div>
  );
};

export default UploadArea;
