import { Menu } from "lucide-react";
import Image from "next/image";
import { PublicUser } from "@/types/auth";
import Link from "next/link";
import VaultStatusBadge from "./vault/VaultStatusBadge";

const Header = ({
  user,
  onOpen,
}: {
  user?: PublicUser | null;
  onOpen: () => void;
}) => {
  return (
    <header className="bg-brand-cream h-18 flex justify-between items-center gap-4 px-4 sm:px-6 text-brand-violet border-b-2 border-brand-border shrink-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 bg-brand-cream-muted border-2 border-brand-violet text-brand-violet hover:bg-brand-peach shadow-[2px_2px_0px_0px_#381D2A] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-xl font-extrabold text-brand-violet tracking-tight">
            Welcome back,{" "}
            <span className="text-brand-brown">{user?.name || "Explorer"}</span>
          </h1>
          <p className="text-[11px] text-brand-violet/70 font-mono hidden sm:block">
            fileflux://console/dashboard · Encrypted Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <VaultStatusBadge />
        <Link
          href="/dashboard/profile"
          className="flex gap-2.5 items-center px-2.5 py-1.5 bg-brand-cream-muted border-2 border-brand-border hover:border-brand-violet text-brand-violet shadow-[2px_2px_0px_0px_#BA5624] hover:shadow-[1px_1px_0px_0px_#BA5624] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <span className="hidden lg:inline text-xs font-bold text-brand-violet">
            {user?.name || "User"}
          </span>
          <div className="relative w-8 h-8 border-2 border-brand-brown overflow-hidden bg-brand-peach">
            <Image
              src={user?.avatarUrl || "/default-avatar.webp"}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
