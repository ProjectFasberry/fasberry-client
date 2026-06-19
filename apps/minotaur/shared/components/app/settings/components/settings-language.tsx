import { LOCALES, LOCALES_MAP, type Locale } from "@/shared/locales"
import { SettingsContentWrapper } from "./ui"
import { getLocale } from "@/paraglide/runtime"
import { reatomComponent } from "@reatom/npm-react"
import { locale } from "@/shared/models/shared.model"
import { settings } from "../models/settings.model"
import { Checkbox } from "@/shared/ui/checkbox"

const SettingsLanguageListItem = reatomComponent<{ value: Locale }>(({ ctx, value }) => {
  const isActive = getLocale() === value;

  const handle = () => {
    locale.change(ctx, value, () => {
      settings.close(ctx)
    })
  }

  return (
    <button
      className="flex cursor-pointer bg-neutral-800 gap-2 hover:bg-neutral-700 duration-150 ease-in w-full rounded-lg px-4 py-2 items-center"
      onClick={handle}
    >
      <Checkbox variant="filled" checked={isActive} label={LOCALES_MAP[value]} />
    </button>
  )
}, "SettingsLanguageListItem")

const SettingsLanguageList = () => {
  return LOCALES.map((locale) => <SettingsLanguageListItem key={locale} value={locale} />)
}

export const SettingsLanguage = () => {
  return (
    <SettingsContentWrapper title="Язык">
      <div className="flex flex-col gap-8 w-full h-full">
        <div className="flex flex-col gap-2 w-full h-full">
          <SettingsLanguageList />
        </div>
      </div>
    </SettingsContentWrapper>
  )
}
