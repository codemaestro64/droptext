// config/app.ts

import { DurationOption } from "@/types"

export const APP_NAME = "DropText"
export const DURATION_OPTIONS: DurationOption[] = [
  {label: "Expires After Reading", value: 0},
  {label: "5 Minutes", value: 5},
  {label: "1 Hour", value: 60}
]