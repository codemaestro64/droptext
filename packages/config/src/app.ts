import { DurationOption } from "./types.js"

export const APP_NAME = "DropText"
export const UUID_SECRET_DELIMETER = ":"
export const DURATION_OPTIONS: DurationOption[] = [
  {label: "Expires After Reading", value: 0},
  {label: "5 Minutes", value: 5},
  {label: "1 Hour", value: 60}
]