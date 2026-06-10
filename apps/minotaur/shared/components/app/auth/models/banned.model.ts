import { client } from "@/shared/lib/client-wrapper"
import { atom, reatomAsync, withAssign, withCache, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/framework"

type BannerPayload = {
  initiator: string,
  expires: Date,
  created_at: Date,
  reason: string | null,
  nickname: string
}

export const banned = atom(null, "banned").pipe(
  withAssign((_, name) => ({
    fetch: reatomAsync(async (ctx) => {
      return await client<BannerPayload>("validate/ban").exec()
    }, `${name}.fetch`).pipe(
      withDataAtom(),
      withStatusesAtom(),
      withCache({ swr: false }),
      withErrorAtom()
    )
  }))
)
