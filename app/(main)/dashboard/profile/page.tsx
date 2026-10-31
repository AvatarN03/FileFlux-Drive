"use client";

import Image from "next/image";
import { User, Mail, ShieldCheck, HardDrive, Calendar, AlertOctagon, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatFileSize } from "@/lib/file";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <User className="w-3 h-3 text-brand-brown" />
            User Identity & Vault Authority
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs text-brand-violet/75">
            Manage your personal credentials, storage limits, and security assertions.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Active Identity Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative w-24 h-24 border-4 border-brand-brown shadow-[4px_4px_0px_0px_#381D2A] overflow-hidden bg-brand-peach">
            <Image
              src={user?.avatarUrl || "/default-avatar.webp"}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-brand-violet">
              {user?.name || "FileFlux Explorer"}
            </h2>
            <p className="text-xs font-mono text-brand-violet/70">
              {user?.email || "user@example.com"}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/15 border border-emerald-700 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Email Verified
          </div>

          <div className="w-full pt-4 border-t border-brand-border space-y-2 text-xs text-left">
            <div className="flex justify-between items-center py-1">
              <span className="text-brand-violet/70">Storage Limit:</span>
              <span className="font-bold text-brand-brown">
                {formatFileSize(user?.storageLimit || 52428800)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-brand-violet/70">Vault Authority:</span>
              <span className="font-mono text-brand-violet font-bold">Standard Owner</span>
            </div>
          </div>
        </div>

        {/* Identity Details & Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-violet pb-3 border-b-2 border-brand-border">
              Authentication Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Primary Email
                </span>
                <div className="font-bold text-brand-violet truncate">
                  {user?.email || "user@example.com"}
                </div>
              </div>

              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Encryption Key Ownership
                </span>
                <div className="font-bold text-brand-brown">
                  Zero-Knowledge Client Derivation
                </div>
              </div>

              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Account Registration
                </span>
                <div className="font-mono text-brand-violet">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Member"}
                </div>
              </div>

              <div className="p-3 bg-brand-cream-muted border border-brand-border space-y-1">
                <span className="text-brand-violet/60 font-mono text-[10px] uppercase">
                  Last Authentication
                </span>
                <div className="font-mono text-brand-violet">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Current Session"}
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-brand-cream border-2 border-red-600 shadow-[4px_4px_0px_0px_#381D2A] p-5">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-red-300">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
                Danger Zone · Irreversible Actions
              </h3>
            </div>

            <p className="text-xs text-brand-violet/80 leading-relaxed mb-4">
              Permanently delete your user account and all client-side encrypted vault assets. This action is immediate and cannot be recovered.
            </p>

            <button
              type="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-brand-cream text-xs font-bold uppercase tracking-wider border-2 border-red-800 shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
            >
              Delete Account & Clear Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

