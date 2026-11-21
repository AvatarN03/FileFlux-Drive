"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";

import vaultApi, { type VaultRecord } from "@/services/vaultApi";

import {
  createVault,
  unlockVaultWithPassphrase,
  unlockVaultWithRecoveryKey,
  rotateVaultPassphrase,
} from "@/lib/crypto";
import toastC from "@/lib/toast";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

interface VaultContextType {
  isEnrolled: boolean | null;
  isError: boolean;
  error: Error | null;
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

const wipeKeyBestEffort = (key: Uint8Array) => {
  try {
    key.fill(0);
  } catch {
    // JavaScript cannot guarantee zeroization if the buffer is frozen or detached.
  }
};

export function VaultProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();

  const [vaultKey, setVaultKey] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeOperationCountRef = useRef(0);
  const vaultOperationVersionRef = useRef(0);
  const previousUserIdRef = useRef<string | null>(null);
  const userId = user?.id ?? null;

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
  const vaultError = vaultQuery.error instanceof Error ? vaultQuery.error : null;

  const startProcessing = useCallback(() => {
    activeOperationCountRef.current += 1;
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    activeOperationCountRef.current = Math.max(
      0,
      activeOperationCountRef.current - 1,
    );
    setIsProcessing(activeOperationCountRef.current > 0);
  }, []);

  // Wipe keys from memory
  const lockVault = useCallback(() => {
    vaultOperationVersionRef.current += 1;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (vaultKey) {
      wipeKeyBestEffort(vaultKey);
    }
    setVaultKey(null);
    // Clear cached metadata that may contain decrypted file or folder names.
    queryClient.removeQueries({ queryKey: ["folders"] });
    queryClient.removeQueries({ queryKey: ["trash-folders"] });
    queryClient.removeQueries({ queryKey: ["files"] });
    queryClient.removeQueries({ queryKey: ["trash-files"] });
    queryClient.removeQueries({ queryKey: ["file"] });
  }, [vaultKey, queryClient]);

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

  // Lock vault and wipe vault cache on logout or account change
  useEffect(() => {
    const previousUserId = previousUserIdRef.current;

    if (previousUserId && previousUserId !== userId) {
      lockVault();
      queryClient.removeQueries({
        queryKey: ["vault", "status", previousUserId],
      });
    }

    previousUserIdRef.current = userId;

    if (!isAuthenticated || !userId) {
      lockVault();
      queryClient.removeQueries({ queryKey: ["vault"] });
    }
  }, [isAuthenticated, userId, lockVault, queryClient]);

  const beginVaultOperation = useCallback(() => {
    vaultOperationVersionRef.current += 1;
    return vaultOperationVersionRef.current;
  }, []);

  // 1. Initial Enrollment
  const enrollMutation = useMutation({
    mutationFn: vaultApi.enrollVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
    },
  });

  const setupVault = useCallback(
    async (passphrase: string): Promise<string> => {
      const operationVersion = beginVaultOperation();
      startProcessing();
      let newKey: Uint8Array | null = null;

      try {
        const enrollmentResult = await createVault(passphrase);
        newKey = enrollmentResult.vaultKey;

        await enrollMutation.mutateAsync({
          kdfParams: enrollmentResult.enrollment.kdfParams,
          passphraseEnvelope: enrollmentResult.enrollment.passphraseEnvelope,
          recoveryEnvelope: enrollmentResult.enrollment.recoveryEnvelope,
        });

        if (operationVersion !== vaultOperationVersionRef.current) {
          throw new Error("Vault setup was cancelled.");
        }

        setVaultKey(newKey);
        const recoveryKeyDisplay = enrollmentResult.enrollment.recoveryKeyDisplay;
        newKey = null;
        return recoveryKeyDisplay;
      } finally {
        if (newKey) wipeKeyBestEffort(newKey);
        stopProcessing();
      }
    },
    [beginVaultOperation, enrollMutation, startProcessing, stopProcessing]
  );

  // 2. Unlock with Passphrase
  const unlockWithPass = useCallback(
    async (passphrase: string): Promise<boolean> => {
      if (!vaultRecord) {
        throw new Error("No vault record found for this account.");
      }

      const operationVersion = beginVaultOperation();
      startProcessing();
      let unlockedKey: Uint8Array | null = null;

      try {
        unlockedKey = await unlockVaultWithPassphrase(
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

        if (operationVersion !== vaultOperationVersionRef.current) {
          throw new Error("Vault unlock was cancelled.");
        }

        setVaultKey(unlockedKey);
        unlockedKey = null;
        return true;
      } finally {
        if (unlockedKey) wipeKeyBestEffort(unlockedKey);
        stopProcessing();
      }
    },
    [beginVaultOperation, vaultRecord, startProcessing, stopProcessing]
  );

  // 3. Unlock with Recovery Key
  const unlockWithRecovery = useCallback(
    async (recoveryKey: string): Promise<boolean> => {
      if (!vaultRecord) {
        throw new Error("No vault record found for this account.");
      }

      const operationVersion = beginVaultOperation();
      startProcessing();
      let unlockedKey: Uint8Array | null = null;

      try {
        unlockedKey = await unlockVaultWithRecoveryKey(recoveryKey, {
          nonce: vaultRecord.recoveryNonce,
          ciphertext: vaultRecord.recoveryCiphertext,
        });

        if (operationVersion !== vaultOperationVersionRef.current) {
          throw new Error("Vault unlock was cancelled.");
        }

        setVaultKey(unlockedKey);
        unlockedKey = null;
        return true;
      } finally {
        if (unlockedKey) wipeKeyBestEffort(unlockedKey);
        stopProcessing();
      }
    },
    [beginVaultOperation, vaultRecord, startProcessing, stopProcessing]
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

      const operationVersion = beginVaultOperation();
      const keyForRotation = new Uint8Array(vaultKey);
      startProcessing();

      try {
        const updated = await rotateVaultPassphrase(keyForRotation, newPassphrase);

        if (operationVersion !== vaultOperationVersionRef.current) {
          throw new Error("Passphrase rotation was cancelled.");
        }

        await rotateMutation.mutateAsync({
          kdfParams: updated.kdfParams,
          passphraseEnvelope: updated.passphraseEnvelope,
        });
        return true;
      } finally {
        wipeKeyBestEffort(keyForRotation);
        stopProcessing();
      }
    },
    [
      beginVaultOperation,
      vaultKey,
      rotateMutation,
      startProcessing,
      stopProcessing,
    ]
  );

  return (
    <VaultContext.Provider
      value={{
        isEnrolled,
        isError: vaultQuery.isError,
        error: vaultError,
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
