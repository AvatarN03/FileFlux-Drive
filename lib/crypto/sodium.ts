import sodium from "libsodium-wrappers-sumo";

let initialized = false;

/**
 * Ensures libsodium-wrappers-sumo WebAssembly runtime is loaded and ready.
 */
export async function getSodium(): Promise<typeof sodium> {
  if (!initialized) {
    await sodium.ready;
    initialized = true;
  }
  return sodium;
}

export type Sodium = typeof sodium;
