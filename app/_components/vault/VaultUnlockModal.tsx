"use client";

import React, { useState } from "react";
import { Lock, KeyRound, Loader2, AlertCircle } from "lucide-react";

import { useVault } from "@/context/VaultContext";
import toastC from "@/lib/toast";

interface VaultUnlockModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function VaultUnlockModal({ isOpen, onClose }: VaultUnlockModalProps) {
  const { unlockWithPass, unlockWithRecovery, isLoading } = useVault();

  const [mode, setMode] = useState<"passphrase" | "recovery">("passphrase");
  const [passphrase, setPassphrase] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [error, setError] = useState<string | null>(null);

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
        toastC({ data: "Vault unlocked using emergency recovery key", type: "success" });
      }
      setPassphrase("");
      setRecoveryKey("");
      onClose?.();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to unlock vault. Please check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-peach">
        <form onSubmit={handleUnlock} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet/20 text-violet">
              {mode === "passphrase" ? <Lock size={26} /> : <KeyRound size={26} />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {mode === "passphrase" ? "Unlock Your Vault" : "Emergency Recovery"}
              </h2>
              <p className="text-xs text-neutral-400">
                {mode === "passphrase"
                  ? "Enter your vault passphrase to decrypt your files."
                  : "Enter your emergency recovery key to regain vault access."}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === "passphrase" ? (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Vault Passphrase
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-ember"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Recovery Key (e.g. XXXXX-XXXXX-...)
              </label>
              <input
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="Paste your 11-group recovery key"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white font-mono placeholder-neutral-500 text-xs tracking-wider focus:outline-none focus:border-ember uppercase"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-ember hover:bg-ember/90 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying Keys...
              </>
            ) : mode === "passphrase" ? (
              "Unlock Vault"
            ) : (
              "Recover & Unlock Vault"
            )}
          </button>

          <div className="pt-2 text-center">
            {mode === "passphrase" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("recovery");
                  setError(null);
                }}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
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
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
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
