import { client } from "@/shared/lib/client-wrapper";
import { logRouting } from "@/shared/lib/log";
import { getStaticImage } from "@/shared/lib/volume-helpers";
import { wrapTitle } from "@/shared/lib/utils";
import { useConfig } from "vike-react/useConfig";
import { render } from "vike/abort";
import { type PageContextServer } from "vike/types";
import { createCtx } from "@reatom/framework";
import { snapshots } from "@/shared/models/ssr";
import { newsSingleState } from "@/shared/components/app/news/models/news-single.model";

export type Data = Awaited<ReturnType<typeof data>>;
export type News = ExtractApiData<"getNewsById">["data"]

function metadata(
  news: News
) {
  return {
    title: wrapTitle(news.title),
    description: news.description.slice(0, 256),
    image: getStaticImage(news.imageUrl!.slice(1))
  }
}

export async function data(pageCtx: PageContextServer) {
  const config = useConfig()

  const headers = pageCtx.headers
  if (!headers) return;

  logRouting(pageCtx.urlPathname, "data");

  const id = pageCtx.routeParams.id

  const news = await client<News>(`news/${id}`, { headers }).exec().catch(e => {
    console.error("News error", e)
    return null;
  })

  if (!news) throw render("/not-exist")

  config(metadata(news))

  const ctx = createCtx()
  newsSingleState.data(ctx, news)

  pageCtx.snapshot = snapshots.merge(ctx, pageCtx)
}
