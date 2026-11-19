"use client";

import { useState } from "react";
import { Activity, ShieldCheck, FileUp, Key, Download, Lock, UserCheck } from "lucide-react";

const ActivityPage = () => {
  const [filter, setFilter] = useState<"all" | "security" | "files">("all");

  const mockActivities = [
    {
      id: "act-1",
      type: "security",
      icon: ShieldCheck,
      iconColor: "text-emerald-700 bg-emerald-100",
      title: "Zero-Knowledge Session Authenticated",
      details: "Client-side Argon2id key derivation succeeded from local browser.",
      timestamp: "Today at 10:32 AM",
    },
    {
      id: "act-2",
      type: "files",
      icon: FileUp,
      iconColor: "text-brand-brown bg-brand-peach",
      title: "File Encrypted & Uploaded",
      details: "Encrypted Financial-Audit-2026.pdf (3.2 MB) with XChaCha20-Poly1305.",
      timestamp: "Today at 09:14 AM",
    },
    {
      id: "act-3",
      type: "security",
      icon: Key,
      iconColor: "text-brand-violet bg-brand-peach-vibrant/30",
      title: "Vault Passphrase Verified",
      details: "Argon2id salt validated. Ephemeral session key unlocked in memory.",
      timestamp: "Yesterday at 04:45 PM",
    },
    {
      id: "act-4",
      type: "files",
      icon: Download,
      iconColor: "text-blue-700 bg-blue-100",
      title: "File Decrypted & Downloaded",
      details: "Downloaded Brand-Tokens.json after client-side authenticated decryption.",
      timestamp: "Yesterday at 02:18 PM",
    },
    {
      id: "act-5",
      type: "security",
      icon: Lock,
      iconColor: "text-brand-brown bg-brand-cream-muted",
      title: "Vault Auto-Locked",
      details: "Security inactivity timeout triggered. In-memory keys cleared safely.",
      timestamp: "Oct 28, 2026 at 11:30 PM",
    },
  ];

  const filtered = mockActivities.filter((act) => {
    if (filter === "all") return true;
    return act.type === filter;
  });

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Activity className="w-3 h-3 text-brand-brown" />
            Audit Logging & Telemetry Stream
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Security & Activity Audit
          </h1>
          <p className="text-xs text-brand-violet/75">
            Transparent event stream of all cryptographic actions, file operations, and session locks.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Static Preview Mode
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
            filter === "all"
              ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
              : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
          }`}
        >
          All Events
        </button>
        <button
          type="button"
          onClick={() => setFilter("security")}
          className={`px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
            filter === "security"
              ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
              : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
          }`}
        >
          Security & Vault Ops
        </button>
        <button
          type="button"
          onClick={() => setFilter("files")}
          className={`px-3.5 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
            filter === "files"
              ? "bg-brand-brown text-brand-cream border-brand-brown shadow-[2px_2px_0px_0px_#381D2A]"
              : "bg-brand-cream text-brand-violet border-brand-border hover:bg-brand-cream-muted"
          }`}
        >
          File Operations
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-4">
          {filtered.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="flex items-start gap-4 p-3.5 bg-brand-cream-muted border-2 border-brand-border hover:border-brand-brown transition-colors"
              >
                <div
                  className={`w-9 h-9 border border-brand-violet/30 flex items-center justify-center shrink-0 ${act.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-brand-violet truncate">
                      {act.title}
                    </h3>
                    <span className="text-[10px] font-mono text-brand-violet/60 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-brand-violet/80 font-medium leading-relaxed">
                    {act.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;

