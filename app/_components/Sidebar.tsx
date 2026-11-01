"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { NavSection } from "@/types/ui";
import { bottomSections, topSections } from "@/constant";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const renderItem = (section: NavSection) => {
    const Icon = section.icon;
    const active = isActive(section.href);
    return (
      <Link
        key={section.key}
        href={section.href}
        title={section.label}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 transition-all text-sm font-bold border-2 cursor-pointer ${
          active
            ? "bg-brand-brown text-brand-cream border-brand-brown-dark shadow-[3px_3px_0px_0px_#26131D]"
            : "border-transparent text-brand-cream/80 hover:text-brand-peach hover:bg-brand-violet"
        }`}
      >
        <Icon
          className={`w-4 h-4 shrink-0 ${
            active ? "text-brand-peach" : "text-brand-peach-vibrant"
          }`}
        />
        <span className="truncate">{section.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop rail — logo pinned at top, icons below */}
      <aside className="hidden md:flex flex-col w-64 h-screen h-dvh bg-brand-violet-dark text-brand-cream p-4 border-r-2 border-brand-violet shrink-0 select-none z-30">
        <div className="flex items-center justify-start pb-4 pt-2">
          <Logo classes="text-brand-cream" />
        </div>
        <div className="w-full border-t-2 border-brand-violet-light my-2" />

        <div className="flex flex-col gap-1.5 mt-2">
          {topSections.map((s) => renderItem(s))}
        </div>

        <div className="flex-1" />

        <div className="w-full border-t-2 border-brand-violet-light my-3" />
        <div className="flex flex-col gap-1.5">
          {bottomSections.map((s) => renderItem(s))}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex h-dvh max-h-dvh">
          <div className="w-72 h-dvh max-h-dvh bg-brand-violet-dark text-brand-cream p-5 flex flex-col border-r-2 border-brand-violet shadow-2xl animate-fadeIn overflow-hidden">
            <div className="flex items-center justify-between pb-3 shrink-0">
              <Logo classes="text-brand-cream" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-1.5 bg-brand-violet border-2 border-brand-peach text-brand-peach hover:bg-brand-brown hover:text-brand-cream transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full border-t-2 border-brand-violet-light my-2 shrink-0" />

            <div className="flex-1 overflow-y-auto flex flex-col justify-between min-h-0 pr-1 pb-6 space-y-4">
              <div className="flex flex-col gap-1.5 mt-2">
                {topSections.map((s) => renderItem(s))}
              </div>

              <div>
                <div className="w-full border-t-2 border-brand-violet-light my-3" />
                <div className="flex flex-col gap-1.5">
                  {bottomSections.map((s) => renderItem(s))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex-1 bg-brand-violet-dark/60 backdrop-blur-xs"
            onClick={onClose}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
