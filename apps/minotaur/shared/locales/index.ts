export type Locale = (typeof LOCALES)[number]

export const LOCALES = ["ru", "en"] as const
export const DEFAULT_LOCALE: Locale = "ru"

export const LOCALES_MAP: Record<Locale, string> = {
  "en": "English",
  "ru": "Russian",
}
