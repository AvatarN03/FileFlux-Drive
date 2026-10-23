"use client";

import React, { useState } from "react";
import { Shield, Key, Download, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";

import { useVault } from "@/context/VaultContext";
import toastC from "@/lib/toast";

interface VaultSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function VaultSetupModal({ isOpen, onClose }: VaultSetupModalProps) {
  const { setupVault, isLoading } = useVault();

  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [step, setStep] = useState<"passphrase" | "recovery">("passphrase");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passphrase.length < 8) {
      setError("Vault passphrase must be at least 8 characters long.");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError("Passphrases do not match.");
      return;
    }

    try {
      const generatedRecoveryKey = await setupVault(passphrase);
      setRecoveryKey(generatedRecoveryKey);
      setStep("recovery");
      toastC({
        data: "Vault key initialized. Please save your recovery key.",
        type: "info",
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to initialize vault.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    toastC({
      data: "Recovery key copied to clipboard",
      type: "success",
    });
  };

  const handleDownloadBackup = () => {
    const content = `=====================================================
FILEFLUX DRIVE — ZERO-KNOWLEDGE EMERGENCY RECOVERY KEY
=====================================================

Recovery Key:
${recoveryKey}

Date Generated: ${new Date().toUTCString()}

IMPORTANT INSTRUCTIONS:
1. Store this file in an offline, secure location (such as an encrypted USB drive).
2. If you lose your vault passphrase, this key is the ONLY way to recover your files.
3. The FileFlux service operator DOES NOT have a copy of this key and CANNOT recover your data if lost.
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fileflux-recovery-key-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    if (!hasConfirmedSaved) {
      setError("Please confirm you have safely stored your recovery key.");
      return;
    }
    toastC({
      data: "Encrypted vault setup complete!",
      type: "success",
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-peach">
        {step === "passphrase" ? (
          <form onSubmit={handleCreateVault} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-ember/20 text-ember">
                <Shield size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Initialize Your Encrypted Vault</h2>
                <p className="text-xs text-neutral-400">
                  Zero-knowledge encryption protects all files before they leave your device.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-neutral-800/60 p-3.5 border border-neutral-700/60 text-xs text-neutral-300 space-y-1.5">
              <p className="font-medium text-amber-300 flex items-center gap-1.5">
                <AlertTriangle size={15} /> Separate Vault Passphrase Required
              </p>
              <p>
                Your vault passphrase encrypts your private master key. It is never sent to the server. If forgotten, it cannot be reset by support.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Vault Passphrase (min. 8 characters)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Choose a strong, memorable passphrase"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-ember"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Confirm Vault Passphrase
                </label>
                <input
                  type="password"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  placeholder="Re-enter your vault passphrase"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-ember"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-ember hover:bg-ember/90 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Deriving Argon2id Keys...
                  </>
                ) : (
                  "Create Secure Vault"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Key size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Save Your Emergency Recovery Key</h2>
                <p className="text-xs text-neutral-400">
                  This key can restore access if you ever lose your vault passphrase.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800 font-mono text-center tracking-wider text-emerald-400 text-sm break-all select-all">
              {recoveryKey}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy Key"}
              </button>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={14} /> Download File (.txt)
              </button>
            </div>

            <label className="flex items-start gap-2.5 pt-2 text-xs text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasConfirmedSaved}
                onChange={(e) => {
                  setHasConfirmedSaved(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-ember focus:ring-ember cursor-pointer"
              />
              <span>
                I have securely saved this recovery key. I understand that FileFlux cannot recover my vault if I lose both my passphrase and recovery key.
              </span>
            </label>

            <button
              type="button"
              onClick={handleFinish}
              disabled={!hasConfirmedSaved}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Confirm & Unlock Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
