import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./provider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FileFlux - FileUploader Platform",
  description: "The ultimate file uploader platform.",
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
