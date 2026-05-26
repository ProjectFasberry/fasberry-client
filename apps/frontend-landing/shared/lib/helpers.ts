import { PageContext } from "vike/types";
import { env } from "../env";

export function getUrl(pageContext: PageContext) {
  return `${env.VITE_LANDING_ENDPOINT}${pageContext.urlPathname}`
}
export const wrapTitle = (i: string) => `Fasberry › ${i}`

export function getStaticObject(path: string, target: string) {
  return `${env.VITE_VOLUME_URL}/static/${path}/${target}`
}

export const isError = (e: Error | unknown): e is Error => e instanceof Error;
