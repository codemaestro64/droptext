import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from '@/config/editor'

const supportedLanguageValues = SUPPORTED_LANGUAGES.map(lang => lang.value)

export const pasteSchema = z.object({
  content: z.string().min(1, 'Paste content is required'),
  language: z.enum([
    ...supportedLanguageValues,
  ] as [typeof supportedLanguageValues[number], ...typeof supportedLanguageValues]),
  hasPassword: z.boolean(),
  duration: z.number()
})

export type PasteSchemaShape = z.infer<typeof pasteSchema>