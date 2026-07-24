// "use client";

// import { ReactNode, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import { Files, Folders, LayoutDashboard } from "lucide-react";

// import Header from "./_components/Header";
// import FileUpload from "./_components/FileUpload";
// import Storage from "./_components/Storage";

// import Loading from "../_uiParts/Loading";

// import { useAuth } from "@/hooks/useAuth";


// const Layout = ({ children }: { children: ReactNode }) => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading,
//   } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   // ✅ Redirect if not authenticated
//   useEffect(() => {
//     if (isLoading) return;

//     if (!user) {
//       router.replace("/auth");
//     }
//   }, [isLoading, user, router]);

//   if (isLoading) {
//     return (
//       <Loading />
//     );
//   }

//   const linkClass = (path: string) =>
//     `p-1 rounded flex items-center gap-1 ${pathname === path
//       ? "bg-violet text-peach"
//       : "text-violet hover:bg-brown bg-brown/70"
//     }`;

//   return (
//     <div className="relative isolate w-screen min-h-screen overflow-x-hidden bg-gradient-62">
//       {/* background */}
//       <div className="absolute inset-0 -z-10 pointer-events-none">
//         <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute top-0 -left-32 opacity-80" />
//         <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute bottom-0 -right-32 opacity-70" />
//       </div>

//       <div className="relative z-10 p-1">
//         <Header />

//         <div className="flex justify-end items-center my-2 px-4">
//           <div className="flex gap-2">
//             <Link href="/dashboard" className={linkClass("/dashboard")}>
//               <LayoutDashboard /> <span className="block">Dashboard</span>
//             </Link>

//             <Link href="/folders" className={linkClass("/folders")}>
//               <Folders /> <span className="block">Folders</span>
//             </Link>

//             <Link href="/files" className={linkClass("/files")}>
//               <Files /> <span className="block">Files</span>
//             </Link>
//           </div>
//         </div>

//         <main className="flex flex-col lg:flex-row gap-2 p-4">
//           <div className="w-full lg:w-1/4 flex flex-col sm:flex-row lg:flex-col gap-4">
//             <FileUpload />
//             <Storage />
//           </div>
//           <div className="w-full lg:w-3/4">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

"use client";

import { ReactNode, useEffect, useState } from "react";

import { useRouter } from "next/navigation";


import Header from "./_components/Header";


import Loading from "../_uiParts/Loading";

import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./_components/Sidebar";


const Layout = ({ children }: { children: ReactNode }) => {
  const {
    user,
    isLoading,
  } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <Loading />
    );
  }


  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gradient-62 flex max-w-500 mx-auto">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />


      <main className="flex-1 flex flex-col min-w-0 space-y-4 bg-neutral-800">
        <Header user={user!} onOpen={() => setSidebarOpen(true)} />
        <div className="p-2 md:p-4 lg:p-6">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;

