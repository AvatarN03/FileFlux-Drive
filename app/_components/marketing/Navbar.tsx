"use client";

import Link from "next/link";
import Logo from "../Logo";

interface NavbarProps {
  navColor?: boolean;
}

const Navbar = ({ navColor }: NavbarProps) => {
  return (
    <header className="w-full sticky top-0 z-50 transition-colors duration-200">
      {/* Top Brand Accent Stripe */}
      <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-brand-brown via-brand-peach-vibrant to-brand-peach" />

      {/* Main Bar in Deep Brand Violet */}
      <div className="w-full bg-brand-violet text-brand-cream border-b border-brand-violet-dark sm:border-b-2 shadow-md">
        <div className="max-w-[1400px] mx-auto h-14 sm:h-16 md:h-18 lg:h-20 flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with Cabinet Icon & Distinct Wordmark */}
          <div className="flex items-center shrink-0">
            <Logo classes="text-brand-cream" />
          </div>

          {/* Action Button: Dashboard */}
          <div className="flex items-center">
            <Link
              href="/auth?continueTo=dashboard"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs sm:text-sm font-bold border-2 border-brand-brown shadow-[2px_2px_0px_0px_#FFA552] sm:shadow-[3px_3px_0px_0px_#FFA552] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#FFA552] transition-all rounded-none shrink-0"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
