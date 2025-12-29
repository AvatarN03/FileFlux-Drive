import { ActionButtonProps } from "@/types/file";


const ActionButton = ({
  onClick,
  icon,
  label,
  variant = "primary",
  title,
  className = "",
}: ActionButtonProps) => {
  const baseClasses =
    "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition cursor-pointer";

  const variantClasses = {
    primary: "bg-violet text-peach hover:bg-violet/80",
    secondary: "bg-brown text-violet hover:bg-ember/50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green text-violet hover:bg-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title={title}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;