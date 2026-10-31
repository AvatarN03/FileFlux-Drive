"use client";

import { useState } from "react";
import { Link2, Copy, Eye, Clock, ShieldAlert, Check, Plus, ExternalLink } from "lucide-react";
import toastC from "@/lib/toast";

const SharedPage = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mockSharedFiles = [
    {
      id: "sh-1",
      fileName: "Brand-Tokens-Export.json",
      link: "https://fileflux.io/share/7b3a9c1e",
      views: 48,
      downloads: 19,
      expiresAt: "In 6 days",
      permission: "Download & View",
      status: "Active",
    },
    {
      id: "sh-2",
      fileName: "Executive-Summary-Pitch.pdf",
      link: "https://fileflux.io/share/8e2f4a01",
      views: 112,
      downloads: 42,
      expiresAt: "In 14 days",
      permission: "View Only",
      status: "Active",
    },
    {
      id: "sh-3",
      fileName: "Product-Preview-Video.mp4",
      link: "https://fileflux.io/share/9c4d2b77",
      views: 230,
      downloads: 65,
      expiresAt: "Expired",
      permission: "View Only",
      status: "Expired",
    },
  ];

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toastC({ data: "Share link copied to clipboard!", type: "success" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Link2 className="w-3 h-3 text-brand-brown" />
            Access Governance & Granular Sharing
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Shared Files & Links
          </h1>
          <p className="text-xs text-brand-violet/75">
            Manage granular public visibility, temporary links, and download permissions.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Static Preview Mode
        </div>
      </div>

      {/* Shared Links Table */}
      <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-brand-cream-muted border-b-2 border-brand-border">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
            Active Public Links ({mockSharedFiles.length})
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-xs font-bold border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-brand-peach" />
            Create Share Link
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-cream-muted/70 text-[10px] font-bold uppercase tracking-wider border-b border-brand-border text-brand-violet">
                <th className="py-2.5 px-4">Shared Asset</th>
                <th className="py-2.5 px-4">Permissions</th>
                <th className="py-2.5 px-4">Telemetry</th>
                <th className="py-2.5 px-4">Expires</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {mockSharedFiles.map((item) => (
                <tr key={item.id} className="hover:bg-brand-cream-muted/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-violet">
                    <div>{item.fileName}</div>
                    <span className="text-[10px] font-mono text-brand-brown">
                      {item.link}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-brand-cream-muted border border-brand-border text-brand-violet">
                      {item.permission}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-mono text-brand-violet/80">
                    <div>{item.views} views</div>
                    <div className="text-[10px] text-brand-violet/60">
                      {item.downloads} downloads
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-mono">
                    <span
                      className={
                        item.status === "Expired"
                          ? "text-red-600 font-bold"
                          : "text-brand-violet/80"
                      }
                    >
                      {item.expiresAt}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.link, item.id)}
                        className="px-2.5 py-1 bg-brand-cream-muted border border-brand-border hover:bg-brand-peach text-brand-violet font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-brand-brown" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-red-100 border border-red-400 hover:bg-red-200 text-red-800 font-bold text-xs cursor-pointer transition-colors"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SharedPage;

