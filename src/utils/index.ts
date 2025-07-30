import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateUUID = (numChars: number): string => {
  return customAlphabet(alphabet, numChars)()
}