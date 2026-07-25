import type { LucideIcon } from "lucide-react"
import Link from "next/link"


export const IsEmpty = ({text, href,link, Icon}:{
    text: string,
    link: string,
    href: string,
    Icon: LucideIcon
}) => {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center  justify-center bg-peach">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brown">
          <Icon className="h-6 w-6 text-violet" strokeWidth={1.5} />
        </div>
        <p className="text-violet">{text}</p>
        <Link
          href={href}
          className="text-sm font-medium   text-peach px-3 py-2  rounded-lg bg-violet hover:shadow-lg"
        >
          {link} →
        </Link>
      </div>
  )
}