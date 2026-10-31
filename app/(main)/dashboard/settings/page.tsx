"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Lock, Sliders, Bell, HardDrive, Save } from "lucide-react";
import toastC from "@/lib/toast";

const SettingsPage = () => {
  const [autoLockMinutes, setAutoLockMinutes] = useState("15");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [chunkSize, setChunkSize] = useState("5MB");

  const handleSave = () => {
    toastC({ data: "Preferences saved successfully! (Preview)", type: "success" });
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-brand-violet">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-peach text-brand-violet text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-border">
            <Settings className="w-3 h-3 text-brand-brown" />
            Workspace & Crypto Configuration
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Account & Security Settings
          </h1>
          <p className="text-xs text-brand-violet/75">
            Configure client-side cryptography timeouts, storage limits, and notification preferences.
          </p>
        </div>

        <div className="px-3 py-1 bg-brand-violet text-brand-peach border border-brand-peach text-[11px] font-bold font-mono uppercase tracking-wider self-start sm:self-auto">
          Static Preview Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Cryptographic Vault Settings */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-brand-border">
            <Lock className="w-4 h-4 text-brand-brown" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Vault & Passphrase Parameters
            </h2>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-brand-violet mb-1 font-bold">
                Auto-Lock Inactivity Timeout
              </label>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(e.target.value)}
                className="w-full p-2.5 bg-brand-cream-muted border-2 border-brand-border text-brand-violet font-semibold focus:outline-none focus:border-brand-brown"
              >
                <option value="5">5 Minutes (High Security)</option>
                <option value="15">15 Minutes (Recommended)</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
              <p className="text-[10px] font-normal text-brand-violet/70 mt-1">
                Wipes the derived secret key from memory after this duration of no activity.
              </p>
            </div>

            <div className="pt-2 border-t border-brand-border">
              <label className="block text-brand-violet mb-1 font-bold">
                Key Derivation Algorithm
              </label>
              <div className="p-2.5 bg-brand-cream-muted border border-brand-border font-mono text-[11px] text-brand-brown">
                Argon2id (libsodium-sumo-v0.8.4) · Salt Length: 16 bytes
              </div>
            </div>

            <div className="pt-2 border-t border-brand-border">
              <label className="block text-brand-violet mb-2 font-bold">
                Master Passphrase Maintenance
              </label>
              <button
                type="button"
                className="px-3.5 py-2 bg-brand-cream-muted hover:bg-brand-peach border-2 border-brand-border text-brand-violet font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Rotate Master Passphrase
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Storage & Ingestion Preferences */}
        <div className="bg-brand-cream border-2 border-brand-violet shadow-[4px_4px_0px_0px_#BA5624] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-brand-border">
            <Sliders className="w-4 h-4 text-brand-brown" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Ingestion & Transfer Tuning
            </h2>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-brand-violet mb-1 font-bold">
                Direct Chunk Upload Size
              </label>
              <select
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
                className="w-full p-2.5 bg-brand-cream-muted border-2 border-brand-border text-brand-violet font-semibold focus:outline-none focus:border-brand-brown"
              >
                <option value="2MB">2 MB (Low latency connections)</option>
                <option value="5MB">5 MB (Optimal for broadband)</option>
                <option value="10MB">10 MB (Large files)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
              <div>
                <div className="font-bold text-brand-violet">Email Security Digests</div>
                <div className="text-[10px] text-brand-violet/70 font-normal">
                  Receive notifications when an unverified device accesses your account.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-brown cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-brand-border">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-brown shadow-[2px_2px_0px_0px_#381D2A] transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-brand-peach" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

