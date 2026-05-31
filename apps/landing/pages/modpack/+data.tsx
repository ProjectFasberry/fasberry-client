import { client } from "@/shared/api/client"
import { wrapClient } from "@/shared/lib/api"
import { getUrl, wrapTitle } from "@/shared/lib/helpers"
import { useConfig } from "vike-solid/useConfig"
import type { PageContext } from "vike/types"
import type { Modpacks } from "./(models)/modpack.model"
import { HTTPError } from "ky"

export type Data = Awaited<ReturnType<typeof data>>

export async function data(pageCtx: PageContext) {
  const config = useConfig()
  const headers = pageCtx.headers
  if (!headers) return;

  const title = wrapTitle("Модпаки")

  const data = await wrapClient<Modpacks>(() => client("modpack/list", { headers }))
    .catch(async (e) => {
      if (e instanceof HTTPError) {
        console.error(await e.response.json())
      }
      throw e;
    })

  config({
    title,
    Head: (
      <>
        <link rel="canonical" href={getUrl(pageCtx)} />
        <meta property="og:url" content={getUrl(pageCtx)} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta name="twitter:title" content={title} />
      </>
    )
  })

  return {
    data
  }
}
