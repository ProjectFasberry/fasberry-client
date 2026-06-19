import { overwriteGetLocale } from "@/paraglide/runtime";
import { logRouting } from "@/shared/lib/log";
import { DEFAULT_LOCALE, type Locale } from "@/shared/locales";
import type { PageContext } from "vike/types";

export const onBeforeRender = (pageCtx: PageContext) => {
  // Locale from the derive payload
  // @ts-expect-error
  const locale = pageCtx?.["runtime"]?.["elysia"]?.["locale"] as Maybe<Locale> ?? DEFAULT_LOCALE;

  overwriteGetLocale(() => locale);

  logRouting(pageCtx.urlPathname, `onBeforeRender`)

  return {
    pageContext: {
      locale
    }
  }
}
