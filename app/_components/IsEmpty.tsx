import type { LucideIcon } from "lucide-react"
import Link from "next/link"


export const IsEmpty = ({ text, href, link, Icon }: {
  text: string,
  link?: string,
  href?: string,
  Icon: LucideIcon
}) => {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center  justify-center bg-ember/40 rounded-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brown">
        <Icon className="h-6 w-6 text-violet" strokeWidth={1.5} />
      </div>
      <p className="text-peach">{text}</p>
      {
        href ? (
          <Link
            href={href}
            className="mt-1 rounded-lg  px-4 py-2 text-sm font-medium  bg-ember cursor-pointer text-peach disabled:opacity-60 hover:shadow-md"
          >
            {link} →
          </Link>
        ) : (
          <p
            className="mt-1 rounded-lg  px-4 py-2 text-sm font-medium  bg-ember cursor-pointer text-peach disabled:opacity-60 hover:shadow-md"
          >
            {link} →
          </p>
        )
      }

    </div>
  )
}