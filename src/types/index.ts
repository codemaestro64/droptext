import { LanguageSupport, StreamLanguage } from "@codemirror/language"

export interface SelectInputOption {
  value: string | number;
  label: string;
}

export interface LanguageOption {
  value: string 
  label: string 
  extension: () => LanguageSupport | StreamLanguage<unknown> | null
}

export interface DurationOption {
  value: number 
  label: string
}

export type BgVariants = "primary" | "success" | "info" | "error"