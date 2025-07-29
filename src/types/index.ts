import { LanguageSupport, StreamLanguage } from "@codemirror/language"

export interface SelectInputOption {
  value: any;
  label: string;
}

export interface LanguageOption {
  value: string 
  label: string 
  extension: () => LanguageSupport | StreamLanguage<unknown> | null
}

export interface ExpirationOption {
  value: number 
  label: string
}