"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import vaultApi, { VaultRecord } from "@/services/vaultApi";
import {
  createVault,
  unlockVaultWithPassphrase,
  unlockVaultWithRecoveryKey,
  rotateVaultPassphrase,
} from "@/lib/crypto";
import { useAuth } from "@/hooks/useAuth";
import toastC from "@/lib/toast";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

interface VaultContextType {
  isEnrolled: boolean | null;
  isUnlocked: boolean;
  isLoading: boolean;
  vaultRecord: VaultRecord | null;
  vaultKey: Uint8Array | null;
  setupVault: (passphrase: string) => Promise<string>;
  unlockWithPass: (passphrase: string) => Promise<boolean>;
  unlockWithRecovery: (recoveryKey: string) => Promise<boolean>;
  lockVault: () => void;
  rotatePass: (newPassphrase: string) => Promise<boolean>;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const [vaultKey, setVaultKey] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch vault record if authenticated (tied to specific user ID)
  const vaultQuery = useQuery({
    queryKey: ["vault", "status", user?.id],
    queryFn: vaultApi.getVault,
    enabled: !!isAuthenticated && !!user?.id,
    staleTime: 10 * 1000, // 10s fresh cache
    retry: 1,
  });

  const isEnrolled = vaultQuery.data ? vaultQuery.data.enrolled : null;
  const vaultRecord = vaultQuery.data ? vaultQuery.data.vault : null;

  // Wipe keys from memory
  const lockVault = useCallback(() => {
    if (vaultKey) {
      // Overwrite bytes in memory before releasing reference
      try {
        vaultKey.fill(0);
      } catch {
        // Uint8Array might be frozen or detached in some runtimes
      }
    }
    setVaultKey(null);
  }, [vaultKey]);

  // Activity listener for inactivity auto-lock
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (vaultKey) {
      inactivityTimerRef.current = setTimeout(() => {
        lockVault();
        toastC({
          data: "Vault automatically locked due to inactivity",
          type: "info",
        });
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [vaultKey, lockVault]);

  useEffect(() => {
    if (!vaultKey) return;

    resetInactivityTimer();

    const handleActivity = () => resetInactivityTimer();
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    window.addEventListener("click", handleActivity, { passive: true });

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [vaultKey, resetInactivityTimer]);

  // Lock vault and wipe vault cache on logout or user change
  useEffect(() => {
    if (!isAuthenticated || !user) {
      lockVault();
      queryClient.removeQueries({ queryKey: ["vault"] });
    }
  }, [isAuthenticated, user, lockVault, queryClient]);

  // 1. Initial Enrollment
  const enrollMutation = useMutation({
    mutationFn: vaultApi.enrollVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
    },
  });

  const setupVault = useCallback(
    async (passphrase: string): Promise<string> => {
      setIsProcessing(true);
      try {
        const { vaultKey: newKey, enrollment } = await createVault(passphrase);

        await enrollMutation.mutateAsync({
          kdfParams: enrollment.kdfParams,
          passphraseEnvelope: enrollment.passphraseEnvelope,
          recoveryEnvelope: enrollment.recoveryEnvelope,
        });

        setVaultKey(newKey);
        return enrollment.recoveryKeyDisplay;
      } finally {
        setIsProcessing(false);
      }
    },
    [enrollMutation]
  );

  // 2. Unlock with Passphrase
  const unlockWithPass = useCallback(
    async (passphrase: string): Promise<boolean> => {
      if (!vaultRecord) {
        throw new Error("No vault record found for this account.");
      }

      setIsProcessing(true);
      try {
        const unlockedKey = await unlockVaultWithPassphrase(
          passphrase,
          {
            salt: vaultRecord.kdfSalt,
            opsLimit: vaultRecord.kdfOpsLimit,
            memLimit: vaultRecord.kdfMemLimit,
            algorithm: vaultRecord.kdfAlgorithm,
          },
          {
            nonce: vaultRecord.passphraseNonce,
            ciphertext: vaultRecord.passphraseCiphertext,
          }
        );

        setVaultKey(unlockedKey);
        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [vaultRecord]
  );

  // 3. Unlock with Recovery Key
  const unlockWithRecovery = useCallback(
    async (recoveryKey: string): Promise<boolean> => {
      if (!vaultRecord) {
        throw new Error("No vault record found for this account.");
      }

      setIsProcessing(true);
      try {
        const unlockedKey = await unlockVaultWithRecoveryKey(recoveryKey, {
          nonce: vaultRecord.recoveryNonce,
          ciphertext: vaultRecord.recoveryCiphertext,
        });

        setVaultKey(unlockedKey);
        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [vaultRecord]
  );

  // 4. Rotate Passphrase
  const rotateMutation = useMutation({
    mutationFn: vaultApi.rotatePassphrase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
    },
  });

  const rotatePass = useCallback(
    async (newPassphrase: string): Promise<boolean> => {
      if (!vaultKey) {
        throw new Error("Vault must be unlocked to rotate passphrase.");
      }

      setIsProcessing(true);
      try {
        const updated = await rotateVaultPassphrase(vaultKey, newPassphrase);
        await rotateMutation.mutateAsync({
          kdfParams: updated.kdfParams,
          passphraseEnvelope: updated.passphraseEnvelope,
        });
        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [vaultKey, rotateMutation]
  );

  return (
    <VaultContext.Provider
      value={{
        isEnrolled,
        isUnlocked: !!vaultKey,
        isLoading: vaultQuery.isLoading || isProcessing,
        vaultRecord,
        vaultKey,
        setupVault,
        unlockWithPass,
        unlockWithRecovery,
        lockVault,
        rotatePass,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
