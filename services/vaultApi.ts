import { EncryptedEnvelope, KdfParameters } from "@/lib/crypto/types";

import { ApiResponse } from "@/types";

import { VAULT_API_ENDPOINTS } from "@/constant";

export interface VaultRecord {
  id: string;
  kdfSalt: string;
  kdfOpsLimit: number;
  kdfMemLimit: number;
  kdfAlgorithm: "argon2id";
  passphraseNonce: string;
  passphraseCiphertext: string;
  recoveryNonce: string;
  recoveryCiphertext: string;
  updatedAt: string | Date;
}

export interface VaultStatusResponse {
  enrolled: boolean;
  vault: VaultRecord | null;
}

export interface EnrollVaultPayload {
  kdfParams: KdfParameters;
  passphraseEnvelope: EncryptedEnvelope;
  recoveryEnvelope: EncryptedEnvelope;
}

export interface RotatePassphrasePayload {
  kdfParams: KdfParameters;
  passphraseEnvelope: EncryptedEnvelope;
}

const vaultApi = {
  async getVault(): Promise<VaultStatusResponse> {
    const res = await fetch(VAULT_API_ENDPOINTS.GET, {
      credentials: "include",
      cache: "no-store",
    });

    const data: ApiResponse & VaultStatusResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch vault status");
    }

    return {
      enrolled: data.enrolled,
      vault: data.vault,
    };
  },

  async enrollVault(payload: EnrollVaultPayload): Promise<void> {
    const res = await fetch(VAULT_API_ENDPOINTS.ENROLL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to enroll vault");
    }
  },

  async rotatePassphrase(payload: RotatePassphrasePayload): Promise<void> {
    const res = await fetch(VAULT_API_ENDPOINTS.ROTATE_PASSPHRASE, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to rotate vault passphrase");
    }
  },
};

export default vaultApi;
