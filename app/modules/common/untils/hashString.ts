import * as Crypto from 'expo-crypto';

export async function sha256(str?: string): Promise<string | null> {
  if (!str) return null
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    str
  );
}