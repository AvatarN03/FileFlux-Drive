import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { Providers } from "./provider";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
      <body
        className={`${plusJakartaSans.className} ${spaceGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}

          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
