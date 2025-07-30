import { z } from 'zod'
import { pasteSchema } from '@/schemas/paste.schema'

export class PasteValidationError extends Error {
  public readonly issues: z.ZodError<typeof pasteSchema>['issues']

  constructor(issues: z.ZodError<typeof pasteSchema>['issues'], message = 'Validation error') {
    super(message)
    this.name = 'PasteValidationError'
    this.issues = issues
  }
}
