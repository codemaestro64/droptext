import { LanguageOption } from "./types.js"
import { go } from "@codemirror/lang-go";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { php } from "@codemirror/lang-php";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { StreamLanguage } from "@codemirror/language";
import { shell as legacyShell } from "@codemirror/legacy-modes/mode/shell";

export const DEFAULT_LANGUAGE = "text";
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: "text", label: "Plain Text", extension: () => null },
  { value: "javascript", label: "JavaScript", extension: javascript },
  { value: "typescript", label: "TypeScript", extension: javascript },
  { value: "python", label: "Python", extension: python },
  { value: "java", label: "Java", extension: java },
  { value: "c", label: "C", extension: cpp },
  { value: "cpp", label: "C++", extension: cpp },
  { value: "csharp", label: "C#", extension: () => null },
  { value: "go", label: "Go", extension: go },
  { value: "rust", label: "Rust", extension: rust },
  { value: "php", label: "PHP", extension: php },
  { value: "ruby", label: "Ruby", extension: () => null },
  { value: "swift", label: "Swift", extension: () => null },
  { value: "kotlin", label: "Kotlin", extension: () => null },
  { value: "scala", label: "Scala", extension: () => null },
  { value: "html", label: "HTML", extension: html },
  { value: "css", label: "CSS", extension: css },
  { value: "scss", label: "SCSS", extension: css }, 
  { value: "less", label: "Less", extension: css }, 
  { value: "json", label: "JSON", extension: json },
  { value: "xml", label: "XML", extension: xml },
  { value: "yaml", label: "YAML", extension: yaml },
  { value: "markdown", label: "Markdown", extension: markdown },
  { value: "sql", label: "SQL", extension: sql },
  { value: "bash", label: "Bash", extension: () => StreamLanguage.define(legacyShell) },
  { value: "powershell", label: "PowerShell", extension: () => null },
  { value: "dockerfile", label: "Dockerfile", extension: () => null },
  { value: "nginx", label: "Nginx", extension: () => null },
  { value: "apache", label: "Apache", extension: () => null },
  { value: "regex", label: "Regular Expression", extension: () => null },
] as const;

export const LANGUAGE_VALUES = SUPPORTED_LANGUAGES.map(l => l.value) as [string, ...string[]];
export type LanguageValue = (typeof SUPPORTED_LANGUAGES)[number]["value"];