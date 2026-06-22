import { mainClient } from "@/shared/api/client"
import { translate } from "@/shared/locales/helpers"
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/framework"
import { action, atom, withAssign } from "@reatom/framework"
import { toast } from "solid-sonner"

export const serverIp = atom(null, "serverIp").pipe(
  withAssign((_, name) => ({
    fetch: reatomAsync(async (ctx) => {
      return await ctx.schedule(() => mainClient
        .GET("/server-ip", { signal: ctx.controller.signal })
        .then(r => r.data?.data ?? null)
      )
    }, `${name}.fetch`).pipe(
      withDataAtom(null, (_, data) => data?.ip ?? null),
      withCache({ swr: false }),
      withStatusesAtom()
    ),
    copyIp: action(async (ctx) => {
      const data = ctx.get(serverIp.fetch.dataAtom)
      if (!data) return;

      await navigator.clipboard.writeText(data)
      toast.success(translate["shared.copied-to-clipboard"]())
    })
  }))
)
