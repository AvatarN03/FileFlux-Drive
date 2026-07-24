import {  Menu } from "lucide-react";
import Image from "next/image";
import { PublicUser } from "@/types/auth";

const Header = ({ user, onOpen }: { user: PublicUser, onOpen: () => void }) => {
  console.log(user)


  return (
    <header className="bg-green/70 h-22 flex justify-between items-center gap-4 px-4 text-violet font-normal">
      <div className="flex items-center gap-4">
          <button className="md:hidden block" onClick={onOpen} >
            <Menu className="w-6 h-6" />
          </button>
        <h1 className="text-base md:text-2xl font-medium">Welcome back, {user.name}!</h1>
      </div>

      <div className="flex gap-2 items-center">
        <h4 className="hidden lg:block">{user.name}</h4>
        <Image
          src={user.avatarUrl || "/default-avatar.webp"}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;
