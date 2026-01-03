import { LanguageSupport, StreamLanguage } from "@codemirror/language"

export interface LanguageOption {
  value: string 
  label: string 
  extension: () => LanguageSupport | StreamLanguage<unknown> | null
}

export interface DurationOption {
  value: number 
  label: string
}