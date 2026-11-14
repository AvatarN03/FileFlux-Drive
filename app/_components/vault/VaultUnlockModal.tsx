"use client";

import React, { useEffect, useState } from "react";
import { Lock, KeyRound, Loader2, AlertCircle, X } from "lucide-react";

import { useVault } from "@/context/VaultContext";
import toastC from "@/lib/toast";

interface VaultUnlockModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function VaultUnlockModal({
  isOpen,
  onClose,
}: VaultUnlockModalProps) {
  const { unlockWithPass, unlockWithRecovery, isLoading } = useVault();

  const [mode, setMode] = useState<"passphrase" | "recovery">("passphrase");
  const [passphrase, setPassphrase] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Allow closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose?.();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "passphrase") {
        if (!passphrase) {
          setError("Please enter your vault passphrase.");
          return;
        }
        await unlockWithPass(passphrase);
        toastC({ data: "Vault unlocked successfully", type: "success" });
      } else {
        if (!recoveryKey.trim()) {
          setError("Please enter your recovery key.");
          return;
        }
        await unlockWithRecovery(recoveryKey.trim());
        toastC({
          data: "Vault unlocked using emergency recovery key",
          type: "success",
        });
      }
      setPassphrase("");
      setRecoveryKey("");
      onClose?.();
    } catch (err: unknown) {
      setError(
        (err as Error).message ||
          "Failed to unlock vault. Please check your credentials."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-violet-dark/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={() => {
        if (!isLoading) onClose?.();
      }}
    >
      <div
        className="w-full max-w-md bg-brand-cream border-2 border-brand-violet p-6 shadow-[8px_8px_0px_0px_#BA5624] text-brand-violet relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-peach border-2 border-brand-violet flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A]">
              {mode === "passphrase" ? (
                <Lock className="w-5 h-5 text-brand-brown" />
              ) : (
                <KeyRound className="w-5 h-5 text-brand-brown" />
              )}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-brand-violet tracking-tight">
                {mode === "passphrase"
                  ? "Unlock Your Vault"
                  : "Emergency Recovery"}
              </h2>
              <p className="text-xs text-brand-violet/70">
                {mode === "passphrase"
                  ? "Enter passphrase to decrypt your files in memory"
                  : "Enter recovery key to restore vault access"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-brand-cream-muted text-brand-violet border border-transparent hover:border-brand-border transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4 mt-5">
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-semibold flex items-start gap-2 shadow-[2px_2px_0px_0px_#e11d48]">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === "passphrase" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                Vault Passphrase
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-brand-cream-muted border-2 border-brand-border focus:border-brand-brown text-brand-violet text-sm font-semibold focus:outline-none placeholder:text-brand-violet/40"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                Emergency Recovery Key
              </label>
              <input
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="e.g. XXXXX-XXXXX-XXXXX..."
                autoFocus
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-brand-cream-muted border-2 border-brand-border focus:border-brand-brown text-brand-violet font-mono text-xs tracking-wider focus:outline-none uppercase placeholder:text-brand-violet/40"
              />
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border-2 border-brand-violet shadow-[2px_2px_0px_0px_#381D2A] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Verifying...
                </>
              ) : mode === "passphrase" ? (
                "Unlock Vault"
              ) : (
                "Recover & Unlock"
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

          <div className="pt-2 text-center">
            {mode === "passphrase" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("recovery");
                  setError(null);
                }}
                className="text-xs font-semibold text-brand-brown hover:text-brand-violet transition-colors underline underline-offset-4 cursor-pointer"
              >
                Forgot your vault passphrase? Use Recovery Key
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("passphrase");
                  setError(null);
                }}
                className="text-xs font-semibold text-brand-brown hover:text-brand-violet transition-colors underline underline-offset-4 cursor-pointer"
              >
                Back to Passphrase Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
