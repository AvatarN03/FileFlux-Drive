import { MobileActionMenuProps } from "@/types/file";


const MobileActionMenu = ({ children, onClose }: MobileActionMenuProps) => {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-2/3 text-xs md:text-base -top-[200%] mt-2 w-36 md:w-44 bg-peach rounded-lg shadow-2xl border-2 border-violet z-40">
        {children}
      </div>
    </>
  );
};

export default MobileActionMenu;