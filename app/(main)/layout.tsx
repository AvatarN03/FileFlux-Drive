"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Files, Folders, LayoutDashboard } from "lucide-react";

import Header from "./_components/Header";
import FileUpload from "./_components/FileUpload";
import Storage from "./_components/Storage";

import useAuthStore from "@/context/useAuthStore";
import Logo from "./_components/Logo";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Run auth check once
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col gap-8 items-center justify-center bg-violet text-peach">
        <div className="bg-green w-fit p-3 rounded-md">
          <Logo />
        </div>
        <div className="w-14 h-14 border-4 border-peach border-t-ember rounded-full animate-spin"></div>
        <p className="mt-4 text-sm md:text-3xl tracking-wide text-peach/80">
          Loading your workspace...
        </p>
      </div>
    );
  }

  const linkClass = (path: string) =>
    `p-1 rounded flex items-center gap-1 ${
      pathname === path
        ? "bg-violet text-peach"
        : "text-violet hover:bg-brown bg-brown/70"
    }`;

  return (
    <div className="relative isolate w-screen min-h-screen overflow-x-hidden bg-gradient-62">
      {/* background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute top-0 -left-32 opacity-80" />
        <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute bottom-0 -right-32 opacity-70" />
      </div>

      <div className="relative z-10 p-1">
        <Header />

        <div className="flex justify-end items-center my-2 px-4">
          <div className="flex gap-2">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard /> <span className="block">Dashboard</span>
            </Link>

            <Link href="/folders" className={linkClass("/folders")}>
              <Folders /> <span className="block">Folders</span>
            </Link>

            <Link href="/files" className={linkClass("/files")}>
              <Files /> <span className="block">Files</span>
            </Link>
          </div>
        </div>

        <main className="flex flex-col lg:flex-row gap-2 p-4">
          <div className="w-full lg:w-1/4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <FileUpload />
            <Storage />
          </div>
          <div className="w-full lg:w-3/4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
