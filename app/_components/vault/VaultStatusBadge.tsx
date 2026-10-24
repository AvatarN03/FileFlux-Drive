"use client";

import React, { useState } from "react";
import { Lock, Unlock, ShieldAlert } from "lucide-react";

import { useVault } from "@/context/VaultContext";
import VaultUnlockModal from "./VaultUnlockModal";
import VaultSetupModal from "./VaultSetupModal";

export default function VaultStatusBadge() {
  const { isEnrolled, isUnlocked, lockVault } = useVault();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  if (isEnrolled === null) {
    return null; // still loading
  }

  if (isEnrolled === false) {
    return (
      <>
        <button
          onClick={() => setShowSetupModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <ShieldAlert size={15} />
          <span>Setup Vault</span>
        </button>
        <VaultSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
        />
      </>
    );
  }

  if (isUnlocked) {
    return (
      <button
        onClick={lockVault}
        title="Vault is unlocked. Click to lock immediately."
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer group"
      >
        <Unlock size={14} className="group-hover:hidden" />
        <Lock size={14} className="hidden group-hover:inline" />
        <span className="group-hover:hidden">Vault Unlocked</span>
        <span className="hidden group-hover:inline">Lock Vault</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowUnlockModal(true)}
        title="Vault is locked. Click to enter your passphrase."
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
      >
        <Lock size={14} />
        <span>Vault Locked</span>
      </button>
      <VaultUnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      />
    </>
  );
}
