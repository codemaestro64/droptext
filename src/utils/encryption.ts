import { gcm } from '@noble/ciphers/aes';
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils';
import { randomBytes } from '@noble/ciphers/webcrypto';

const toBase64Url = (buf: Uint8Array) =>
  btoa(String.fromCharCode(...buf))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (b64url: string): Uint8Array => {
  let base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
};

export const deriveKey = async (key: Uint8Array, password: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const data = new Uint8Array([...key, ...encoder.encode(password)]);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
};

export const encryptText = async(text: string, password: string) => {
  const key = randomBytes(32); 
  const finalKey = password.trim()
    ? await deriveKey(key, password)
    : key;

  const nonce = randomBytes(12);
  const data = utf8ToBytes(text);
  const aes = gcm(finalKey, nonce);
  const cipherText = aes.encrypt(data);

  return {
    cipherText: toBase64Url(cipherText),
    hashSecret: toBase64Url(key) + '.' + toBase64Url(nonce),
  };
};

export const decryptText = async (encryptedText: string, hashSecret: string, password: string): Promise<string> => {
  const [keyB64, nonceB64] = hashSecret.split('.');
  if (!keyB64 || !nonceB64) {
    throw new Error("Invalid hashSecret format");
  }

  const rawKey = fromBase64Url(keyB64);
  const nonce = fromBase64Url(nonceB64);

  const key = password.trim()
    ? await deriveKey(rawKey, password)
    : rawKey;

  const aes = gcm(key, nonce);
  const ciphertext = fromBase64Url(encryptedText);
  const plaintextBytes = aes.decrypt(ciphertext);
  return bytesToUtf8(plaintextBytes);
};
