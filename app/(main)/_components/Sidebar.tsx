"use client";

import {
  X,

} from "lucide-react";
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
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors last:last-of-type:mb-4 justify-start text-brown/70 hover:text-ember ${active ? "bg-brown" : "hover:bg-peach  "}`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${active && "text-violet"}`} />
        
          <span className={`text-sm font-semibold ${active && "text-violet"}`}>
            {section.label}
          </span>
    
      </Link>
    );
  };

  return (
    <>
      {/* Desktop rail — logo pinned at top, icons below, centered */}
      <div className="hidden md:flex flex-col w-64 h-dvh bg-neutral-900 p-2 gap-2 shadow-lg shadow-violet text-brown border-r border-peach">
        <div className="flex items-center justify-center py-4 ">
          <Logo />
        </div>
        <hr className="my-3"/>
        {topSections.map((s) => renderItem(s))}
        <div className="flex-1" />
        {bottomSections.map((s) => renderItem(s))}
      </div>

      {/* Mobile drawer — logo at top, icon + label below */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-dvh bg-neutral-900 p-4 flex flex-col gap-2 shadow-lg shadow-violet text-peach">
            <div className="flex items-center justify-between mb-4 ">
              <Logo />
              <button onClick={onClose} className="p-2 rounded-md bg-neutral-800 hover:bg-brown">
                <X className="w-5 h-5 text-ember" />
              </button>
            </div>
            <hr className="my-2" />
            {topSections.map((s) => renderItem(s))}
            <div className="flex-1" />
            {bottomSections.map((s) => renderItem(s))}
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-xs" onClick={onClose} />
        </div>
      )}
    </>
  );
};

export default Sidebar;