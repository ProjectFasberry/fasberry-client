import { client } from "@/shared/api/client"
import { wrapClient } from "@/shared/lib/api"
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/framework"
import { action, atom, withAssign } from "@reatom/framework"
import { toast } from "solid-sonner"

export const serverIp = atom(null, "serverIp").pipe(
  withAssign((_, name) => ({
    fetch: reatomAsync(async (ctx) => {
      return await ctx.schedule(() =>
        wrapClient<ExtractApiData<"getServer-ip">["data"]>(() => client("server-ip", { signal: ctx.controller.signal, }))
      )
    }, `${name}.fetch`).pipe(
      withDataAtom(null, (_, data) => data.ip),
      withCache({ swr: false }),
      withStatusesAtom()
    ),
    copyIp: action(async (ctx) => {
      const data = ctx.get(serverIp.fetch.dataAtom)
      if (!data) return;

      await navigator.clipboard.writeText(data)
      toast.success("IP успешно скопирован!")
    })
  }))
)
