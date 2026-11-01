"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, User, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicUser } from "@/types/auth";
import VaultStatusBadge from "./vault/VaultStatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { useVault } from "@/context/VaultContext";
import { useQueryClient } from "@tanstack/react-query";
import toastC from "@/lib/toast";

const Header = ({
  user,
  onOpen,
}: {
  user?: PublicUser | null;
  onOpen: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { logout } = useAuth();
  const { lockVault } = useVault();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      lockVault();
      queryClient.clear();
      await logout();
      toastC({
        data: "Signed out successfully",
        type: "success",
      });
      setIsOpen(false);
      router.push("/auth");
    } catch {
      setIsOpen(false);
      router.push("/auth");
    } finally {
      setIsSigningOut(false);
    }
  };

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

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="User account menu"
            className="flex gap-2.5 items-center px-2.5 py-1.5 bg-brand-cream-muted border-2 border-brand-border hover:border-brand-violet text-brand-violet shadow-[2px_2px_0px_0px_#BA5624] hover:shadow-[1px_1px_0px_0px_#BA5624] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
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
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#381D2A] z-50 p-3 space-y-3 animate-fadeIn">
              {/* User details in small */}
              <div className="flex items-center gap-3 pb-3 border-b-2 border-brand-border">
                <div className="relative w-10 h-10 border-2 border-brand-brown overflow-hidden bg-brand-peach shrink-0">
                  <Image
                    src={user?.avatarUrl || "/default-avatar.webp"}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-brand-violet truncate">
                    {user?.name || "FileFlux Explorer"}
                  </p>
                  <p className="text-[11px] font-mono text-brand-violet/70 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* Navigation & actions */}
              <div className="space-y-1.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-brand-violet bg-brand-cream-muted border border-brand-border hover:bg-brand-peach hover:border-brand-violet transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-brand-brown" />
                  <span>Account Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-brand-violet bg-brand-cream-muted border border-brand-border hover:bg-red-50 hover:text-red-700 hover:border-red-600 transition-colors cursor-pointer disabled:opacity-50 text-left"
                >
                  {isSigningOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5 text-brand-brown" />
                  )}
                  <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
