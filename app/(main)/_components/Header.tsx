"use client";
import { useState } from "react";

import { DoorOpen, LogOut, User } from "lucide-react";

import  useAuthStore  from "@/context/useAuthStore";
import Logo from "./Logo";

const Header = () => {
  const { user, logout, deleteAccount } = useAuthStore();
  console.log(user);
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      await deleteAccount();
    }
  };

  return (
    <header className="w-screen p-[0.5px] shadow-md">
      <div className="max-w-[1500px] mx-auto h-20 flex justify-between items-center gap-4 px-4">
        {/* logo  */}
        <Logo />
        <div className=" flex gap-2 items-center">
          <div className="hidden md:flex flex-col ">
            <h3 className="text-base font-medium">{user.name}</h3>
            <p className="text-ember text-sm">{user.email}</p>
          </div>
          <div
            className="rounded-full w-12 h-12 flex justify-center items-center text-peach cursor-pointer bg-violet border-4 border-ember"
            onClick={() => setOpen(true)}
          >
            <User />
          </div>
        </div>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full p-4 flex-col flex   relative gap-4 bg-brown rounded-lg max-w-[380px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-start flex-col items-center gap-4 w-full my-4 border-dashed border-violet border-4 p-2 rounded-md">
                <div className="w-22 h-22 bg-violet flex justify-center items-center rounded-full">
                  <User className="text-peach" size={32} />
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h1 className="text-base font-bold">{user.name}</h1>
                  <p className="text-violet/70 text-sm font-bold">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-between">
                  <button
                    className="md:gap-2 items-center self-end inline-flex bg-red-800 text-peach  hover:text-green cursor-pointer  p-2 rounded-md"
                    onClick={handleDeleteAccount}
                  >
                    <DoorOpen />
                    Delete Account
                  </button>
                  <button
                    className="gap-2 items-center self-end inline-flex bg-violet text-peach  hover:text-green cursor-pointer px-3 py-2 rounded-md"
                    onClick={logout}
                  >
                    <LogOut />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
