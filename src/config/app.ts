// config/app.ts

import { ExpirationOption } from "@/types"

export const APP_NAME = "DropText"
export const EXPIRATION_OPTIONS: ExpirationOption[] = [
  {label: "Expires After Reading", value: 0},
  {label: "5 Minutes", value: 5},
  {label: "1 Hour", value: 60}
]