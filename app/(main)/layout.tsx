"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "../_components/Header";
import Sidebar from "../_components/Sidebar";
import Loading from "../_components/marketing/Loading";

import { useAuth } from "@/hooks/useAuth";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const currentUrl = `${pathname}${search}`;
      const destination =
        currentUrl && currentUrl !== "/auth" && currentUrl !== "/"
          ? `/auth?continueTo=${encodeURIComponent(currentUrl)}`
          : "/auth";

      router.replace(destination);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex bg-brand-cream text-brand-violet selection:bg-brand-peach selection:text-brand-violet">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-brand-cream">
        <Header user={user} onOpen={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto bg-brand-cream text-brand-violet">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

