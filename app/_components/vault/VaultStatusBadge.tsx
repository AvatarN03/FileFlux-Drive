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
          type="button"
          onClick={() => setShowSetupModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-peach text-brand-violet border-2 border-brand-violet text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#BA5624] hover:bg-brand-peach-vibrant hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
        >
          <ShieldAlert size={14} className="text-brand-brown" />
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
        type="button"
        onClick={lockVault}
        title="Vault is unlocked. Click to lock immediately."
        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream-muted text-emerald-800 border-2 border-emerald-700 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#064e3b] hover:bg-emerald-100 hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer group"
      >
        <Unlock size={14} className="group-hover:hidden text-emerald-700" />
        <Lock size={14} className="hidden group-hover:inline text-brand-brown" />
        <span className="group-hover:hidden">Vault Unlocked</span>
        <span className="hidden group-hover:inline text-brand-brown">Lock Vault</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowUnlockModal(true)}
        title="Vault is locked. Click to enter your passphrase."
        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-brown text-brand-cream border-2 border-brand-violet text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#381D2A] hover:bg-brand-brown-dark hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
      >
        <Lock size={14} className="text-brand-peach" />
        <span>Vault Locked</span>
      </button>
      <VaultUnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
      />
    </>
  );
}
