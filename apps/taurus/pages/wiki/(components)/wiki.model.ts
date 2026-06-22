import { mainClient } from "@/shared/api/client";
import { reatomAsync, withCache, withStatusesAtom } from "@reatom/framework";
import { atom, withAssign } from "@reatom/framework";

export type Wiki = {
  category: string,
  content: any,
  title: string;
  updated_at: Date | null
}

type CategoryNode = { title: string, value: string }
type RulesCategoriesPayloadExtend = {
  [key: string]: { title: string, isChilded: boolean, nodes: CategoryNode[] }
}

export const WIKI_PARAM_FALLBACK = "general"

export const wikiState = atom(null, "wikiState").pipe(
  withAssign((_, name) => ({
    param: atom(WIKI_PARAM_FALLBACK, `${name}.param`),
    categories: atom<Entries<RulesCategoriesPayloadExtend>>([], `${name}.categories`),
    categoriesNodes: atom<CategoryNode[]>([], `${name}.categoriesNodes`)
  }))
)

export const wikiCategories = atom(null, "wikiCategories").pipe(
  withAssign((_, name) => ({
    fetch: reatomAsync(async (ctx) => {
      return await ctx.schedule(() =>
        mainClient.GET("/wiki/categories", { signal: ctx.controller.signal }).then(r => r.data?.data ?? null)
      )
    }, {
      name: `${name}.fetch`,
      onFulfill: (ctx, res) => {
        if (!res) return;

        const categories = Object.entries(
          Object.fromEntries(
            Object.entries(res).map(([key, val]) => [
              key,
              { ...val, isChilded: val.nodes.length > 0 && val.nodes[0].value !== key }
            ])
          )
        )

        const nodes = categories.flatMap(([_, group]) => group.nodes)

        wikiState.categories(ctx, categories);
        wikiState.categoriesNodes(ctx, nodes);
      }
    }).pipe(
      withCache({ swr: false }),
      withStatusesAtom()
    )
  }))
)

export const getIsActiveAtom = (value: string) => atom((ctx) =>
  value === ctx.spy(wikiState.param) ? "active" : "inactive"
)
