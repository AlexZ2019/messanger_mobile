import * as Crypto from 'expo-crypto';

export const sha256 = async (str?: string): Promise<string | null> => {
  if (!str) return null;

  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    str
  );
};