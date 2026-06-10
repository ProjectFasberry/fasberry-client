import { client, withQueryParams } from "@/shared/lib/client-wrapper"
import { atom } from "@reatom/framework";
import { withSsr } from "@/shared/models/ssr";
import { withAssign } from "@reatom/framework";

type NewsPayload = ExtractApiData<"getNewsList">["data"]
export type NewsParams = ExtractApiParams<"getNewsList">["query"]

export const getNews = async (params: Partial<NewsParams>, init?: RequestInit) => {
  return client
    .get<NewsPayload>("news/list", { ...init })
    .pipe(withQueryParams(params))
    .exec()
}

export const newsState = atom(null, "newsState").pipe(
  withAssign((_, name) => ({
    data: atom<NewsPayload["data"]>([], `${name}.data`).pipe(withSsr(`${name}.data`)),
  }))
)
