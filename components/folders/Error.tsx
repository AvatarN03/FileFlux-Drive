import { AlertCircle } from "lucide-react";

interface ErrorProps {
  isRefetching: boolean;
  handleRetry: () => void;
  text: string;
}

export const Error = ({
  isRefetching,
  handleRetry,
  text,
}: ErrorProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 border-2 border-brand-brown bg-brand-cream-muted px-6 py-12 text-center text-brand-violet shadow-brown-3"
    >
      <div className="flex h-12 w-12 items-center justify-center border-2 border-brand-brown bg-brand-peach shadow-violet-2">
        <AlertCircle className="h-6 w-6 text-brand-brown" strokeWidth={2.5} />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-brand-violet">{text}</p>
        <p className="text-xs font-medium text-brand-violet/70">
          Something went wrong on our end. Give it another try.
        </p>
      </div>

      <button
        type="button"
        onClick={handleRetry}
        disabled={isRefetching}
        aria-busy={isRefetching}
        className="border-2 border-brand-brown bg-brand-brown px-4 py-2 text-xs font-bold text-brand-cream shadow-violet-2 transition-all hover:-translate-y-px hover:bg-brand-brown-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRefetching ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
};
