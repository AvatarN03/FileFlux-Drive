"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  Key,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

import { useVault } from "@/context/VaultContext";
import toastC from "@/lib/toast";

interface VaultSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function VaultSetupModal({
  isOpen,
  onClose,
}: VaultSetupModalProps) {
  const { setupVault, isLoading } = useVault();

  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [step, setStep] = useState<"passphrase" | "recovery">("passphrase");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && step === "passphrase") {
        onClose?.();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isLoading, step, onClose]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-violet-dark/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={() => {
        if (!isLoading && step === "passphrase") onClose?.();
      }}
    >
      <div
        className="w-full max-w-lg bg-brand-cream border-2 border-brand-violet p-6 shadow-[8px_8px_0px_0px_#BA5624] text-brand-violet relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-peach border-2 border-brand-violet flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A]">
              {step === "passphrase" ? (
                <Shield className="w-5 h-5 text-brand-brown" />
              ) : (
                <Key className="w-5 h-5 text-brand-brown" />
              )}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-brand-violet tracking-tight">
                {step === "passphrase"
                  ? "Initialize Your Encrypted Vault"
                  : "Save Your Emergency Recovery Key"}
              </h2>
              <p className="text-xs text-brand-violet/70">
                {step === "passphrase"
                  ? "Zero-knowledge encryption protects all files client-side"
                  : "This key restores access if you ever lose your passphrase"}
              </p>
            </div>
          </div>
          {step === "passphrase" && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1 hover:bg-brand-cream-muted text-brand-violet border border-transparent hover:border-brand-border transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {step === "passphrase" ? (
          <form onSubmit={handleCreateVault} className="space-y-4 mt-5">
            <div className="p-3 bg-brand-peach/30 border-2 border-brand-brown text-xs text-brand-violet space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-brand-brown-dark">
                <AlertTriangle size={15} /> Separate Vault Passphrase Required
              </p>
              <p className="text-brand-violet/80 text-[11px] leading-relaxed">
                Your passphrase wraps your private master key in memory using
                Argon2id. It is never sent to the server. If lost, your vault
                cannot be recovered without your emergency recovery key.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-semibold shadow-[2px_2px_0px_0px_#e11d48]">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Vault Passphrase (min. 8 characters)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Choose a strong, memorable passphrase"
                  disabled={isLoading}
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 bg-brand-cream-muted border-2 border-brand-border focus:border-brand-brown text-brand-violet text-sm font-semibold focus:outline-none placeholder:text-brand-violet/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                  Confirm Vault Passphrase
                </label>
                <input
                  type="password"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  placeholder="Re-enter your vault passphrase"
                  disabled={isLoading}
                  required
                  className="w-full px-3.5 py-2.5 bg-brand-cream-muted border-2 border-brand-border focus:border-brand-brown text-brand-violet text-sm font-semibold focus:outline-none placeholder:text-brand-violet/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Deriving
                    Argon2id Keys...
                  </>
                ) : (
                  "Create Secure Vault"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="py-2.5 px-4 bg-brand-cream hover:bg-brand-cream-muted text-brand-violet font-bold text-xs uppercase tracking-wider border-2 border-brand-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 mt-5">
            {error && (
              <div className="p-3 bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-semibold shadow-[2px_2px_0px_0px_#e11d48]">
                {error}
              </div>
            )}

            <div className="p-3.5 bg-brand-cream-muted border-2 border-brand-violet font-mono text-center tracking-wider text-brand-brown font-extrabold text-xs sm:text-sm break-all select-all shadow-[2px_2px_0px_0px_#381D2A]">
              {recoveryKey}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2 px-3 bg-brand-cream border-2 border-brand-border hover:border-brand-brown text-brand-violet text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied" : "Copy Key"}
              </button>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="flex-1 py-2 px-3 bg-brand-peach border-2 border-brand-violet hover:bg-brand-peach-vibrant text-brand-violet text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#381D2A]"
              >
                <Download size={14} /> Download (.txt)
              </button>
            </div>

            <label className="flex items-start gap-2.5 pt-1 text-xs text-brand-violet/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasConfirmedSaved}
                onChange={(e) => {
                  setHasConfirmedSaved(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 border-brand-border text-brand-brown focus:ring-brand-brown cursor-pointer"
              />
              <span className="text-[11px] leading-normal font-medium">
                I have securely saved this recovery key. I understand FileFlux
                cannot recover my vault if I lose both my passphrase and
                recovery key.
              </span>
            </label>

            <button
              type="button"
              onClick={handleFinish}
              disabled={!hasConfirmedSaved}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#064e3b] transition-all cursor-pointer"
            >
              Confirm & Unlock Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
