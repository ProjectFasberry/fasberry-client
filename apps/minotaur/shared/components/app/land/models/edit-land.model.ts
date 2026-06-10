import { logError } from "@/shared/lib/log"
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/framework"
import { action, atom } from "@reatom/framework"
import { withAssign, withReset } from "@reatom/framework"
import { toast } from "sonner"

type NewLandChangesKeys = "banner" | "gallery"

export const landEditingState = atom(null, "landEditingState").pipe(
  withAssign((_, name) => ({
    mode: atom<0 | 1>(0, `${name}.mode`).pipe(withReset()),
    personalization: atom(null, `${name}.personalization`).pipe(
      withAssign((_, name) => ({
        bannerUrl: atom("", `${name}.bannerUrl`).pipe(withReset()),
        galleryUrls: atom<string[]>([], `${name}.galleryUrls`).pipe(withReset())
      }))
    ),
    changes: atom<Record<NewLandChangesKeys | string, string[]>>({}, `${name}.changes`).pipe(withReset())
  }))
)

export const landEditing = atom(null, "landEditing").pipe(
  withAssign((_, name) => ({
    cancel: action((ctx) => {
      landEditing.resetFull(ctx)
    }, `${name}.cancel`),
    resetFull: action((ctx) => {
      landEditingState.mode.reset(ctx)
      landEditingState.changes.reset(ctx)
      landEditingState.personalization.galleryUrls.reset(ctx)
      landEditingState.personalization.bannerUrl.reset(ctx)
    }),
    banner: atom(null, `${name}.banner`).pipe(
      withAssign((_, name) => ({
        s: action((ctx, e: React.FormEvent<HTMLInputElement>) => {
          const value = e.currentTarget.files ? e.currentTarget.files[0] : null

          if (value) {
            const url = URL.createObjectURL(value)
            landEditingState.changes(ctx, (state) => ({ ...state, "banner": [url] }))
          }
        }, `${name}.s`)
      }))
    ),
    submit: reatomAsync(async (ctx) => {
      const isChanges = ctx.get(changesIsExistAtom)
      if (!isChanges) return null;

      const changes = ctx.get(landEditingState.changes)

      toast.warning("Not implemented. Soon...")
      return null;
      // return await ctx.schedule(async () => {
      //
      // })
    }, {
      name: `${name}.submit`,
      onFulfill: (ctx, res) => {
        if (!res) return;

        landEditing.resetFull(ctx)
      },
      onReject: (ctx, e) => {
        logError(e)
      }
    }).pipe(
      withStatusesAtom(),
      withErrorAtom()
    )
  }))
)

export const changesIsExistAtom = atom((ctx) => {
  const state = ctx.spy(landEditingState.changes)
  const flatValues = Object.values(state).flat()
  return Object.keys(state).length > 0 && flatValues.length > 0
}, "changesIsExist")

landEditingState.changes.onChange((ctx, state) => {
  const keys = Object.keys(state)

  if (keys.includes("banner")) {
    landEditingState.personalization.bannerUrl(ctx, state["banner"][0])
  }

  if (keys.includes("gallery")) {
    landEditingState.personalization.galleryUrls(ctx, state["gallery"])
  }
})

export const landActionTitleAtom = atom((ctx) => ctx.spy(landEditingState.mode) === 0 ? "Редактирование" : "Просмотр")

export const bannerEditIsAllowedAtom = atom((ctx) => {
  const isEdit = ctx.spy(landEditingState.mode) === 1
  const newBanner = ctx.spy(landEditingState.personalization.bannerUrl)

  return isEdit && !newBanner
})
