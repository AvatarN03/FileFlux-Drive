import { AlertCircle } from "lucide-react"


export const Error = ({ isRefetching, handleRetry, text }: {
  isRefetching: boolean,
  handleRetry: () => void,
  text: string
}) => {
  return (
     <div className="flex flex-col items-center gap-3 rounded-xl border border-brown bg-peach py-14 text-center  justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brown/50">
          <AlertCircle className="h-6 w-6 text-violet" strokeWidth={2} />
        </div>
        <div>
          <p className="font-medium text-violet">{text}</p>
          <p className="mt-1 text-sm text-amber-900">
            Something went wrong on our end. Give it another try.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleRetry()}
          disabled={isRefetching}
          className="mt-1 rounded-lg  px-4 py-2 text-sm font-medium  bg-ember cursor-pointer text-peach disabled:opacity-60 hover:shadow-md"
        >
          {isRefetching ? "Retrying..." : "Try again"}
        </button>
      </div>
  )
}