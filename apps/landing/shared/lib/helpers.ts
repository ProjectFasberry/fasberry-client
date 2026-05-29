import type { PageContext } from "vike/types";
import { env } from "../env";

export const getUrl = (pageCtx: PageContext) => `${env.VITE_LANDING_ENDPOINT}${pageCtx.urlPathname}`
export const getStaticObject = (path: string, target: string) => `${env.VITE_VOLUME_URL}/static/${path}/${target}`

export const wrapTitle = (i: string) => `Fasberry › ${i}`

export const isError = (e: Error | unknown): e is Error => e instanceof Error;
