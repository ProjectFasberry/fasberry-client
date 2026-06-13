import { client } from "../lib/client-wrapper"
import { action, atom, type Ctx } from "@reatom/framework";
import { withAssign, withReset } from "@reatom/framework";
import { playerSeemsLikePlayersIsShowKey, playerSLPState } from "../components/app/player/models/player-seems-like.model";
import { parseBoolean } from "../lib/utils";
import { parseCookie } from "../lib/cookie-utils";
import type { PageContextServer } from "vike/types";
import { useInView } from "react-intersection-observer";
import { useUpdate } from "@reatom/npm-react";
import { withSsr } from "./ssr";
import { invariant } from "../lib/invariant";

type ExistNicknamePayload = ExtractApiData<"getValidateNicknameByNickname">["data"]
export async function getExistNickname(nickname: string) {
  return client<ExistNicknamePayload>(`validate/nickname/${nickname}`).exec()
}

type PofCallback = Partial<{
  onSolve: (token: string) => void,
  onError: (e: unknown) => void,
  onReady: () => void
}>

export const pof = atom(null, "pof").pipe(
  withAssign((_, name) => ({
    isOpen: atom(false, `${name}.isOpen`),
    cb: atom<PofCallback | null>(null, `${name}.cb`).pipe(withReset()),
    resetAll: action((ctx) => {
      pof.isOpen(ctx, false)
      pof.cb.reset(ctx)
    }),
  })),
);

type Target<T = unknown> = Record<string, {
  atom: (ctx: Ctx, atom: any) => void, validator?: (value: string | T) => T;
}>

const COOKIE_TARGETS: Target = {
  [playerSeemsLikePlayersIsShowKey]: {
    atom: playerSLPState.settings.isShow, validator: (v) => typeof v === "string" ? parseBoolean(v) : v
  }
};

export const initCookie = action((ctx: Ctx, headers: NonNullable<PageContextServer["headers"]>) => {
  const cookies = parseCookie(headers["cookie"]);
  if (!Object.keys(cookies).length) return;

  for (const [key, value] of Object.entries(cookies)) {
    const target = COOKIE_TARGETS[key as keyof typeof COOKIE_TARGETS];
    if (!target) continue;

    const final = target.validator?.(value) ?? value;
    target.atom(ctx, final);
  }
})

export const createViewerModel = ({ name, logging }: { name: string, logging?: boolean }) => {
  const inViewAtom = atom(false, `${name}.inViewAtom`);

  const Component = () => {
    const { ref, inView } = useInView({
      triggerOnce: false, threshold: 0
    })

    useUpdate((ctx) => inViewAtom(ctx, inView), [inView])

    return (
      <div ref={ref} className="h-px" />
    )
  }

  if (logging) {
    inViewAtom.onChange((_, state) => console.log(inViewAtom.__reatom.name, state))
  }

  return {
    Component,
    inViewAtom
  }
}

type Socials = ExtractApiData<"getMiscSocials">["data"];

export async function fetchSocials() {
  return await client<Socials>("misc/socials").exec()
}

export const socialsAtom = atom<Socials>([], "socials").pipe(withSsr("socials"))

type Currencies = ExtractApiData<"getMiscCurrencies">["data"];

export async function fetchCurrencies() {
  return await client<Currencies>("misc/currencies").exec()
}
export const currenciesAtom = atom<Currencies | null>(null, "currencies").pipe(withSsr("currencies"))

export const getCurrencies = action((ctx) => {
  const data = ctx.get(currenciesAtom)
  invariant(data, "Currencies is not defined")
  return data
})
