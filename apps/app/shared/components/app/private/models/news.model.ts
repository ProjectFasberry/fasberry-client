import * as z from "zod";
import { action, atom, type AtomMut } from "@reatom/framework";
import { reatomAsync, withAssign, withCache, withDataAtom, withReset, withStatusesAtom } from "@reatom/framework";
import { createNewsSchema, newsUpdateSchema } from "@/shared/schemas/news";
import { toast } from "sonner";
import { client, withJsonBody, withQueryParams } from "@/shared/lib/client-wrapper";
import { generateHTML, type JSONContent } from "@tiptap/react"
import { actionsState, collectChanges, compareChanges, notifyAboutRestrictRole } from "./actions.model";
import { withUndo } from "@reatom/undo";
import { alertDialog } from "@/shared/components/config/alert-dialog/alert-dialog.model";
import { navigate } from "vike/client/router";
import { editorExtensions } from "@/shared/components/config/editor/editor.model";

export type NewsPayload = ExtractApiData<"getNewsList">["data"]
type News = NewsPayload["data"][number];

export const newsList = {
  fetch: reatomAsync(async (ctx) => {
    return await ctx.schedule(() =>
      client
        .get<NewsPayload>("privated/news/list", { signal: ctx.controller.signal })
        .pipe(withQueryParams({ asc: false, content: true }))
        .exec()
    )
  }, {
    name: `newsList.fetch`
  }).pipe(
    withDataAtom(null),
    withStatusesAtom(),
    withCache({ swr: false })
  )
}

export const createNewsState = atom(null, "createNewsState").pipe(
  withAssign((_, name) => ({
    title: atom("", `${name}.title`).pipe(withReset()),
    desc: atom("", `${name}.description`).pipe(withReset()),
    imageUrl: atom("", `${name}.imageUrl`).pipe(withReset()),
    content: atom<JSONContent | null>(null, `${name}.content`).pipe(withReset()),
    tempContent: atom<string>("", `${name}.tempContent`).pipe(withReset())
  }))
)
export const createNews = atom(null, "createNews").pipe(
  withAssign((_, name) => ({
    resetFull: action((ctx) => {
      createNewsState.title.reset(ctx)
      createNewsState.desc.reset(ctx)
      createNewsState.imageUrl.reset(ctx)
      createNewsState.content.reset(ctx)
      createNewsState.tempContent.reset(ctx)
    }),
    isValid: atom((ctx) =>
      createNewsSchema.safeParse({
        title: ctx.spy(createNewsState.title),
        description: ctx.spy(createNewsState.desc),
        imageUrl: ctx.spy(createNewsState.imageUrl),
        content: ctx.spy(createNewsState.content),
      }).success
    ),
    contentIsValid: atom((ctx) => ctx.spy(createNewsState.tempContent).length >= 1, `${name}.contentIsValid`),
    saveContent: action((ctx, json: JSONContent) => {
      createNewsState.content(ctx, json);
      toast.success("Изменения применены")
    }),
    submit: reatomAsync(async (ctx) => {
      const json = {
        title: ctx.get(createNewsState.title),
        description: ctx.get(createNewsState.desc),
        imageUrl: ctx.get(createNewsState.imageUrl),
        content: ctx.get(createNewsState.content)
      }

      return await client
        .post<News>("privated/news/create")
        .pipe(withJsonBody(json))
        .exec()
    }, {
      name: `${name}.submit`,
      onFulfill: (ctx, res) => {
        toast.success("Новость создана")

        newsList.fetch.cacheAtom.reset(ctx)
        newsList.fetch.dataAtom(ctx, (state) => state ? { data: [...state.data, res], meta: state.meta } : null)
        createNews.resetFull(ctx)
      },
      onReject: (_, e) => notifyAboutRestrictRole(e)
    }).pipe(
      withStatusesAtom()
    )
  }))
)

export const editNewsState = atom(null, "editNewsState").pipe(
  withAssign((_, name) => ({
    title: atom<string>('', `${name}.title`).pipe(withReset(), withUndo({ length: 200 })),
    description: atom<string>('', `${name}.description`).pipe(withReset(), withUndo({ length: 200 })),
    content: atom<JSONContent | null>(null, `${name}.content`).pipe(withReset(), withUndo()),
    imageUrl: atom<string>('', `${name}.imageUrl`).pipe(withReset(), withUndo()),
    tempContent: atom<string>('', `${name}.tempContent`).pipe(withReset(), withUndo({ length: 200 }))
  }))
)

const editFormAtoms: Record<string, AtomMut<any>> = {
  title: editNewsState.title,
  description: editNewsState.description,
  content: editNewsState.content,
  imageUrl: editNewsState.imageUrl,
  tempContent: editNewsState.tempContent,
}

export const editNews = atom(null, "editNews").pipe(
  withAssign((_, name) => ({
    item: atom((ctx) => {
      const id = ctx.spy(actionsState.target);

      if (!id) {
        console.warn("Actions target is not defined")
        return null;
      }

      const targets = ctx.spy(newsList.fetch.dataAtom)?.data;

      if (!targets) {
        console.warn("Targets is not defined. Refetching...")
        newsList.fetch(ctx);
        return null;
      }

      const targetItem = targets.find(target => target.id === Number(id))
      if (!targetItem) throw new Error("target item is not defined")

      const targetValues = {
        title: targetItem.title,
        description: targetItem.description,
        content: targetItem.content as JSONContent,
        imageUrl: targetItem.imageUrl,
        tempContent: generateHTML(targetItem.content as JSONContent, editorExtensions)
      }

      editNewsState.title(ctx, targetValues.title)
      editNewsState.description(ctx, targetValues.description)
      editNewsState.content(ctx, targetValues.content)
      editNewsState.imageUrl(ctx, targetValues.imageUrl!)

      return targetItem
    }),
    isValid: atom((ctx) => {
      const payload = {
        title: ctx.spy(editNewsState.title),
        description: ctx.spy(editNewsState.description),
        imageUrl: ctx.spy(editNewsState.imageUrl),
        tempContent: ctx.spy(editNewsState.tempContent),
      }

      const old = {
        title: ctx.spy(editNewsState.title.historyAtom)[1],
        description: ctx.spy(editNewsState.description.historyAtom)[1],
        imageUrl: ctx.spy(editNewsState.imageUrl.historyAtom)[1],
        tempContent: ctx.spy(editNewsState.tempContent.historyAtom)[1],
      }

      return compareChanges(payload, old)
    }, `${name}.isValid`),
    getOldValues: action((ctx) => ({
      title: ctx.get(editNewsState.title.historyAtom)[1],
      description: ctx.get(editNewsState.description.historyAtom)[1],
      content: ctx.get(editNewsState.content.historyAtom)[1],
      imageUrl: ctx.get(editNewsState.imageUrl.historyAtom)[1],
    })),
    getValues: action((ctx) => ({
      title: ctx.get(editNewsState.title),
      description: ctx.get(editNewsState.description),
      content: ctx.get(editNewsState.content),
      imageUrl: ctx.get(editNewsState.imageUrl),
    })),
    resetFull: action((ctx) => {
      editNewsState.title.reset(ctx)
      editNewsState.description.reset(ctx)
      editNewsState.imageUrl.reset(ctx)
      editNewsState.content.reset(ctx)
      editNewsState.tempContent.reset(ctx)
    }),
    updateField: action((ctx, key: keyof typeof editFormAtoms, value: any) => {
      const fieldAtom = editFormAtoms[key]
      if (!fieldAtom) return
      fieldAtom(ctx, value)
    }),
    saveContent: action((ctx, json: JSONContent) => {
      editNewsState.content(ctx, json);
      toast.success("Изменения применены")
    }),
    submit: reatomAsync(async (ctx) => {
      const id = ctx.get(actionsState.target);

      const changes = collectChanges(
        editNews.getValues(ctx),
        editNews.getOldValues(ctx)
      )

      const body = Object.entries(changes).map(([field, value]) => ({ field, value })) as z.infer<typeof newsUpdateSchema>

      return await client
        .post(`privated/news/${id}/edit`)
        .pipe(withJsonBody(body))
        .exec()
    }, {
      name: "editNewsAction",
      onFulfill: (ctx, res) => {
        toast.success("Изменения сохранены");

        ctx.schedule(() => navigate("/private/config"));
        editNews.resetFull(ctx);
      },
      onReject: (_, e) => notifyAboutRestrictRole(e)
    }).pipe(
      withStatusesAtom()
    )
  }))
)

const itemToRemoveAtom = atom<{ id: number, title: string } | null>(null, "itemToRemove").pipe(withReset())

export const deleteNews = atom(null, "deleteNews").pipe(
  withAssign((_, name) => ({
    deleteBefore: action((ctx, item: { id: number, title: string }) => {
      itemToRemoveAtom(ctx, item)

      alertDialog.open(ctx, {
        title: `Вы точно хотите удалить "${item.title}"?`,
        confirmAction: action((ctx => deleteNews.submit(ctx, item.id))),
        confirmLabel: "Удалить",
        cancelAction: action((ctx) => itemToRemoveAtom.reset(ctx)),
        autoClose: true
      });
    }, `${name}.deleteBefore`),
    submit: reatomAsync(async (ctx, id: number) => {
      return await client.delete<{ id: number }>(`privated/news/${id}`).exec()
    }, {
      name: `${name}.submit`,
      onFulfill: (ctx, res) => {
        toast.success("Новость удалена")

        newsList.fetch.cacheAtom.reset(ctx)
        newsList.fetch.dataAtom(ctx, (state) => state ? { data: state.data.filter(news => news.id !== res.id), meta: state.meta } : null)
      },
      onReject: (_, e) => notifyAboutRestrictRole(e)
    }).pipe(
      withStatusesAtom()
    )
  }))
)
