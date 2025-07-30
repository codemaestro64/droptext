import { SUPPORTED_LANGUAGES, UUID_SECRET_DELIMETER } from '@/config';
import { customAlphabet } from 'nanoid'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateUUID = (numChars: number): string => {
  return customAlphabet(alphabet, numChars)()
}

export const uuidSecretFromSlug = (
  slug: string
): { uuid: string; secret: string } => {
  return (([uuid, secret]) => ({ uuid, secret }))(slug.split(UUID_SECRET_DELIMETER));
};

export const uuidSecretToSlug = (uuid: string, secret: string): string =>
  [uuid, secret].join(UUID_SECRET_DELIMETER);

export const editorExtensionsFromLanguage = (language: string) => {
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === language)
  const ext = selectedLanguage?.extension?.()

  return ext ? [ext] : []
}

export const getTimeRemaining = (baseDate: Date, minutesToAdd: number): string => {
  if (minutesToAdd === 0) {
    return "first read";
  }

  const futureDate = new Date(baseDate.getTime() + minutesToAdd * 60_000);
  const now = new Date();

  const diffMs = futureDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Expired";
  }

  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  if (totalWeeks >= 1) return `${totalWeeks} week${totalWeeks > 1 ? "s" : ""}`;
  if (totalDays >= 1) return `${totalDays} day${totalDays > 1 ? "s" : ""}`;
  if (totalHours >= 1) return `${totalHours} hour${totalHours > 1 ? "s" : ""}`;
  return `${totalMinutes} minute${totalMinutes > 1 ? "s" : ""}`;
};
