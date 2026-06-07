import { type PageContextServer } from "vike/types";
import { useConfig } from 'vike-react/useConfig'
import { wrapTitle } from "@/shared/lib/utils";
import { getStaticImage } from "@/shared/lib/volume-helpers";
import { logRouting } from "@/shared/lib/log";
import { env } from "@/shared/env";
import { getNews, newsState } from "@/shared/components/app/news/models/news.model";
import { createCtx, type Ctx } from "@reatom/framework";
import { snapshots } from "@/shared/models/ssr";
import { eventsState, getEvents } from "@/shared/components/app/events/models/events.model";

const previewImage = getStaticImage("arts/8332de192322939.webp")
const title = wrapTitle("Главная")
const description = `
  Официальное приложение майнкрафт-проекта Fasberry.
  Жанр: RP, RPG, полу-ванила. 1.20.1+. Играть: ${`play.${env.VITE_MAIN_DOMAIN}`}.
`

function metadata(pageCtx: PageContextServer) {
  return {
    title,
    image: previewImage,
    description,
    Head: (
      <>
        <meta property="og:url" content={pageCtx.urlPathname} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow, noarchive" />
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </>
    ),
  }
}

async function init(ctx: Ctx, pageCtx: PageContextServer) {
  const headers = pageCtx.headers ?? undefined;

  const [news, events] = await Promise.all([
    getNews({ limit: 3, asc: false }, { headers }),
    getEvents({ limit: 3 }, { headers })
  ])

  newsState.data(ctx, news.data)
  eventsState.data(ctx, events);
}

export async function data(pageCtx: PageContextServer) {
  const config = useConfig()

  logRouting(pageCtx.urlPathname, "data");

  config(metadata(pageCtx))

  const ctx = createCtx()
  await init(ctx, pageCtx);

  pageCtx.snapshot = snapshots.merge(ctx, pageCtx)
}
