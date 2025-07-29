import { gcm } from '@noble/ciphers/aes';
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils';
import { randomBytes } from '@noble/ciphers/webcrypto';

const toBase64 = (buf: Uint8Array) => btoa(String.fromCharCode(...buf));
const fromBase64 = (b64: string) => new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));

const deriveKey = (key: Uint8Array, password: string): Uint8Array => {
  const pwdBytes = utf8ToBytes(password);
  const derived = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    derived[i] = (key[i % key.length] ^ pwdBytes[i % pwdBytes.length]) % 256;
  }
  return derived;
};

export const encryptText = (text: string, password: string) => {
  const key = randomBytes(32);
  const finalKey = password.trim()
    ? deriveKey(key, password)
    : key;

  const nonce = randomBytes(12);
  const data = utf8ToBytes(text);
  const aes = gcm(finalKey, nonce);
  const cipherText = aes.encrypt(data);

  return {
    cipherText: toBase64(cipherText),
    hashSecret: toBase64(key) + "." + toBase64(nonce),
  };
};

export const decryptText = (encryptedText: string, hashSecret: string, password: string): string => {
  const [keyB64, nonceB64] = hashSecret.split(".");
  if (!keyB64 || !nonceB64) {
    throw new Error("Invalid hashSecret format");
  }

  const rawKey = fromBase64(keyB64);
  const nonce = fromBase64(nonceB64);

  const key = password.trim()
    ? deriveKey(rawKey, password)
    : rawKey;

  const aes = gcm(key, nonce);
  const ciphertext = fromBase64(encryptedText);
  const plaintextBytes = aes.decrypt(ciphertext);
  return bytesToUtf8(plaintextBytes);
};