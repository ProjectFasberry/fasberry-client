import { m } from "@/paraglide/messages.js";
import type { PageContext } from "vike/types";
import { DEFAULT_LOCALE, type Locale } from "./index";

export const translate = m;

export const getLocaleByRuntime = (pageCtx: PageContext): Locale => {
  // Locale from the derive payload
  // @ts-expect-error
  return pageCtx?.["runtime"]?.["elysia"]?.["locale"] as Maybe<Locale> ?? DEFAULT_LOCALE;
}
