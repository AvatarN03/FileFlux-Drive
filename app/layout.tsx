import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { Providers } from "./provider";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FileFlux - Drive",
  description: "A cloud storage solution for your files and folders.",
  keywords: ["cloud storage", "file management", "folders", "files", "drive"],
  authors: [{ name: "AvatarN03" }],
  icons: {
    icon: "logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${sora.className} antialiased`}>
        <Providers>{children}

          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
