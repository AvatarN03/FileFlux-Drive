"use client";

import {
  Home,
  Folder,
  FolderTree,
  Clock,
  Star,
  Link2,
  Trash2,
  HardDrive,
  Activity,
  Settings,
  User,
  X,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "./Logo";
import Image from "next/image";
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

  const renderItem = (section: NavSection, showLabel: boolean) => {
    const Icon = section.icon;
    const active = isActive(section.href);
    return (
      <Link
        key={section.key}
        href={section.href}
        title={section.label}
        onClick={onClose}
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors last:last-of-type:mb-4 ${showLabel ? "justify-start" : "justify-center"
          } ${active ? "bg-brown" : "hover:bg-brown"}`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${active ? "text-violet" : "text-violet/70"}`} />
        {showLabel && (
          <span className={`text-sm font-semibold ${active ? "text-violet" : "text-violet/70"}`}>
            {section.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop rail — logo pinned at top, icons below, centered */}
      <div className="hidden md:flex flex-col w-16 h-dvh bg-peach p-2 gap-2 shadow-lg shadow-violet">
        <div className="flex items-center justify-center py-4 ">
          <Link href={"/"} className="flex justify-center items-center gap-1 hover:shadow-md hover:animate-" title="FileFlux">
            <Image src={"/logo.png"} width={40} height={40} alt="logo" className="w-8  h-8" />
          </Link>
        </div>
        <hr className="my-3"/>
        {topSections.map((s) => renderItem(s, false))}
        <div className="flex-1" />
        {bottomSections.map((s) => renderItem(s, false))}
      </div>

      {/* Mobile drawer — logo at top, icon + label below */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-dvh bg-peach p-4 flex flex-col gap-2 shadow-lg shadow-violet">
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <button onClick={onClose} className="p-2 rounded-md hover:bg-brown">
                <X className="w-5 h-5 text-violet" />
              </button>
            </div>
            <hr className="my-2" />
            {topSections.map((s) => renderItem(s, true))}
            <div className="flex-1" />
            {bottomSections.map((s) => renderItem(s, true))}
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-xs" onClick={onClose} />
        </div>
      )}
    </>
  );
};

export default Sidebar;