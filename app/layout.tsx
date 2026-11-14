import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import { Providers } from "./provider";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "FileFlux - Drive",
  description: "A cloud storage solution for your files and folders.",
  keywords: ["cloud storage", "file management", "folders", "files", "drive"],
  authors: [{ name: "AvatarN03" }],
  icons: {
    icon: "/logo-cabinet.svg",
    shortcut: "/logo-cabinet.svg",
    apple: "/logo-cabinet.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}

          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
