import { localeDefault } from "@/shared/locales";
import { localeAtom } from "@/shared/models/global.model";
import { action, atom, sleep, withAssign, withConcurrency, withReset } from "@reatom/framework";
import { navigate } from "vike/client/router";

export const WEATHERS = [
  { title: "Ясная", value: "clean" },
  { title: "Дождливая", value: "rain" },
  { title: "Снежная", value: "snow" }
] as const;

export const LANGUAGES = [
  { title: "Русский", value: "ru" },
  { title: "Английский", value: "en" },
]

export type Weather = typeof WEATHERS[number]["value"]

export const selectedWeatherAtom = atom((ctx) =>
  WEATHERS.find(d => d.value === ctx.spy(layoutSettingsState.selectedWeather)) ?? WEATHERS[0]
)
export const selectedLangAtom = atom((ctx) =>
  LANGUAGES.find(d => d.value === ctx.spy(localeAtom)) ?? LANGUAGES[0]
)

localeAtom.onChange((ctx, state) => {
  let link = `/${state}`
  if (state === localeDefault) {
    link = `/`
  }
  ctx.schedule(() => navigate(link))
})

export const layoutSettings = atom(null, "layoutSettings").pipe(
  withAssign((_, name) => ({
    open: action(async (ctx) => {
      layoutSettingsState.isTriggered(ctx, true);

      await ctx.schedule(() => sleep(150));

      layoutSettingsState.isOpen(ctx, true);
      layoutSettingsState.isTriggered.reset(ctx);
    }, `${name}.open`).pipe(
      withConcurrency()
    ),
    middleware: action((ctx, cb: () => void) => {
      layoutSettingsState.isOpen(ctx, false);
      cb();
    })
  }))
)

export const layoutSettingsState = atom(null, "layoutSettingsState").pipe(
  withAssign((_, name) => ({
    isOpen: atom(false, `${name}.isOpen`),
    isTriggered: atom(false, `${name}.isTriggered`).pipe(withReset()),
    selectedWeather: atom<Weather>("clean")
  }))
)
