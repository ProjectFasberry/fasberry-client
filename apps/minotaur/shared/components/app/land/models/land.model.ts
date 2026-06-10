import { action, reatomAsync, withAssign, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/framework";
import { atom } from "@reatom/framework";
import { withReset } from "@reatom/framework";
import { currentUserState } from "@/shared/models/current-user/index.model";
import { withHistory } from "@/shared/lib/reatom/helpers";
import { withSsr } from "@/shared/models/ssr";
import { logError } from "@/shared/lib/log";
import { client, withQueryParams } from "@/shared/lib/client-wrapper";
import { isEmptyArray } from "@/shared/lib/helpers";
import type { PageContextServer } from "vike/types";
import { render } from "vike/abort";

export type Land = ExtractApiData<"getServerLandsByUlid">["data"]
type LandExtended = Land & {
  points?: { [key: string]: { x: number, y: number } }
}

export const landAtom = atom<LandExtended | null>(null, "land").pipe(withReset(), withSsr("land"));

export const landParamAtom = atom<string>((ctx) => {
  const state = ctx.spy(landAtom);
  if (!state) return "";
  return state.ulid;
}, "landParamAtom").pipe(withHistory());

export const landOwnerAtom = atom<string | null>((ctx) => {
  const state = ctx.spy(landAtom);
  if (!state || state.members.length === 0) return null;

  return state.members[0].nickname;
}, "landOwner").pipe(withReset());

export const landIsMemberAtom = atom<boolean>((ctx) => {
  const currentUser = ctx.spy(currentUserState);
  if (!currentUser) return false;
  const state = ctx.spy(landAtom);
  if (!state) return false;

  return state.members.some((exist) => exist.nickname === currentUser.nickname);
}, "landIsMemberAtom").pipe(withReset());

export const landIsOwnerAtom = atom((ctx) => {
  const currentUser = ctx.spy(currentUserState);
  if (!currentUser) return false;
  const owner = ctx.spy(landOwnerAtom)
  if (!owner) return false;

  return currentUser.nickname === owner;
}, "landIsOwnerAtom").pipe(withReset());

export const landBannerAtom = atom((ctx) => {
  const state = ctx.spy(landAtom);
  if (!state) return null;
  return state.details.banner
}, "landBanner").pipe(withReset());

export const landGalleryAtom = atom<string[]>((ctx) => {
  const state = ctx.spy(landAtom);
  if (!state) return [];
  return state.details.gallery ?? [];
}, "landGalleryAtom").pipe(withReset());

export const land = atom(null, "lands").pipe(
  withAssign((_, name) => ({
    /**
     * Server-side only
     */
    init: action(async (ctx, pageCtx: PageContextServer) => {
      const headers = pageCtx.headers ?? undefined;
      const ulid = pageCtx.routeParams.id;

      const land = await client<Land>(`server/lands/${ulid}`, { headers }).exec().catch(e => {
        console.error("Land error", e);
        return null;
      })

      if (!land) throw render("/not-exist?type=land")

      const result = landAtom(ctx, { ...land, points: { ["init"]: { x: 412.12, y: 65.6 } } })
      return result!;
    }),
    fetchSimilar: reatomAsync(async (ctx) => {
      const nickname = ctx.get(landOwnerAtom)
      if (!nickname) return;

      const exclude = ctx.get(landParamAtom);

      return await ctx.schedule(() => client
        .get<ExtractApiData<"getServerLandsList">["data"]>(`server/lands/similar`, {
          signal: ctx.controller.signal
        })
        .pipe(withQueryParams({ exclude }))
        .exec(),
      );
    }, {
      name: `${name}.fetchSimilar`,
      onReject: (_, e) => {
        logError(e, { type: "combined" });
      },
    }).pipe(
      withDataAtom(null, (_, data) => data?.data ? isEmptyArray(data.data) ? null : data.data : null),
      withStatusesAtom(),
      withErrorAtom()
    )
  }))
)
