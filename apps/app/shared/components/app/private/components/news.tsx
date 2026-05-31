import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Avatar } from "@/shared/ui/avatar";
import { createLink, Link } from "@/shared/components/config/link";
import { Typography } from "@/shared/ui/typography"
import { type ReactNode } from "react";
import { actionsState, type ActionType, actions, getSelectedParentAtom } from "../models/actions.model";
import { ToActionButtonX, ButtonXSubmit } from "./global";
import { createNews, createNewsState, editNews, editNewsState, deleteNews, newsList, type NewsPayload } from "../models/news.model"
import { Input } from "@/shared/ui/input"
import { type Atom, type AtomMut, type Ctx } from "@reatom/framework"
import { DeleteButton, EditButton, ToLink, ActionButton } from "./ui"
import { EditorMenuBar } from "@/shared/components/config/editor/editor"
import { Editor, EditorContent, generateJSON, type JSONContent, useEditor, useEditorState } from "@tiptap/react"
import { CharacterCount, Placeholder } from "@tiptap/extensions"
import { editorExtensions } from "@/shared/components/config/editor/editor.model";

type News = NewsPayload["data"][number]

const NewsContentApply = reatomComponent<{
  tempContentAtom: Atom<string>,
  saveAction: (json: JSONContent) => void,
  isValidAtom: Atom<boolean>
}>(({ ctx, tempContentAtom, isValidAtom, saveAction }) => {
  const handle = () => {
    const contentStr = ctx.get(tempContentAtom)

    if (!contentStr) {
      console.warn("Content is empty")
      return
    }

    const json = generateJSON(contentStr, editorExtensions)
    saveAction(json)
  }

  const isDisabled = !ctx.spy(isValidAtom)

  return <ActionButton variant="selected" icon="sprite:check" disabled={isDisabled} onClick={handle} />
}, "CreateNewsContentApply")

const NewsContent = reatomComponent<{
  initValue?: string | null | JSONContent,
  tempContentAtom: AtomMut<string>,
  isValidAtom: Atom<boolean>,
  saveAction: (ctx: Ctx, json: JSONContent) => void
}>(({
  ctx, tempContentAtom, initValue, saveAction, isValidAtom
}) => {
  console.log(initValue);

  const editor = useEditor({
    extensions: [
      ...editorExtensions,
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Напишите что-нибудь...',
      }),
    ],
    content: initValue,
    onUpdate: ({ editor }) => {
      tempContentAtom(ctx, editor.getHTML())
    }
  })

  const { charactersCount, wordsCount } = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor.isDestroyed) return {
        charactersCount: 0,
        wordsCount: 0,
      };

      return {
        charactersCount: ctx.editor.storage.characterCount.characters(),
        wordsCount: ctx.editor.storage.characterCount.words(),
      }
    },
  })

  return (
    <div className="flex flex-col group gap-4 w-full h-full">
      <div className="flex flex-col">
        <EditorMenuBar editor={editor} />
        <EditorContent
          editor={editor}
          className="border text-lg border-neutral-800 rounded-md bg-neutral-800"
        />
      </div>
      <div className="flex items-center justify-end gap-4 w-full">
        <div className="text-neutral-400 text-sm">
          {charactersCount}/{1024} символов ({wordsCount} слов)
        </div>
        <NewsContentApply
          tempContentAtom={tempContentAtom}
          isValidAtom={isValidAtom}
          saveAction={(json) => saveAction(ctx, json)}
        />
      </div>
    </div>
  )
}, "CreateNewsContent")

const EditNewsSubmit = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(editNews.isValid) || ctx.spy(editNews.submit.statusesAtom).isPending

  return <ButtonXSubmit title="Редактировать" isDisabled={isDisabled} action={() => editNews.submit(ctx)} />
}, "EditNewsSubmit")
const EditNewsTitleInput = reatomComponent(({ ctx }) => {
  const old = ctx.get(editNewsState.title.historyAtom)[1]
  const value = ctx.spy(editNewsState.title)

  return (
    <Input
      value={value ?? old ?? ''}
      onChange={e => editNews.updateField(ctx, 'title', e.target.value)}
      placeholder="Заголовок"
    />
  )
}, "EditNewsTitleInput")
const EditNewsDescInput = reatomComponent(({ ctx }) => {
  const old = ctx.get(editNewsState.description.historyAtom)[1]
  const value = ctx.spy(editNewsState.description)

  return (
    <Input
      value={value ?? old ?? ''}
      onChange={e => editNews.updateField(ctx, 'description', e.target.value)}
      placeholder="Описание"
    />
  )
}, "EditNewsDescInput")
const EditNewsForm = reatomComponent(({ ctx }) => {
  const item = ctx.spy(editNews.item);
  if (!item) return <Typography>Выбранный объект не найден</Typography>

  return (
    <div className="flex flex-col w-full gap-2">
      <EditNewsTitleInput />
      <EditNewsDescInput />
      <div className="flex flex-col gap-2 w-full">
        <NewsContent
          isValidAtom={editNews.isValid}
          initValue={item.content as JSONContent}
          tempContentAtom={editNewsState.tempContent}
          saveAction={editNews.saveContent}
        />
      </div>
    </div>
  )
}, "EditNewsForm")

const CreateNewsTitle = reatomComponent(({ ctx }) => {
  return (
    <Input
      placeholder="Заголовок"
      value={ctx.spy(createNewsState.title)}
      onChange={(e) => createNewsState.title(ctx, e.target.value)}
    />
  )
}, "CreateNewsTitle")
const CreateNewsDesc = reatomComponent(({ ctx }) => {
  return (
    <Input
      placeholder="Описание"
      value={ctx.spy(createNewsState.desc)}
      onChange={(e) => createNewsState.desc(ctx, e.target.value)}
    />
  )
}, "CreateNewsDesc")
const CreateNewsImage = reatomComponent(({ ctx }) => {
  return (
    <Input
      placeholder="Изображение"
      value={ctx.spy(createNewsState.imageUrl)}
      onChange={e => createNewsState.imageUrl(ctx, e.target.value)}
    />
  )
}, "CreateNewsImage")

const CreateNewsSubmit = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(createNews.isValid) || ctx.spy(createNews.submit.statusesAtom).isPending

  return <ButtonXSubmit title="Создать" action={() => createNews.submit(ctx)} isDisabled={isDisabled} />
}, "CreateNewsSubmit")

const CreateNewsForm = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <CreateNewsTitle />
      <CreateNewsDesc />
      <CreateNewsImage />
      <div className="flex flex-col gap-2 w-full">
        <NewsContent
          isValidAtom={createNews.contentIsValid}
          saveAction={createNews.saveContent}
          tempContentAtom={createNewsState.tempContent}
        />
      </div>
    </div>
  )
}

const NewsListItem = reatomComponent<News>(({ ctx, id, title, imageUrl, creator }) => {
  return (
    <div
      className="flex h-22 border border-neutral-800 p-2
        rounded-lg overflow-hidden items-center gap-2 justify-between w-full"
    >
      <div className="flex items-center gap-2">
        <img
          src={imageUrl!}
          alt={title}
          draggable={false}
          className="h-18 w-28 rounded-lg select-none object-cover"
        />
        <div className="flex flex-col items-start gap-1">
          <Typography className="font-semibold">
            {title}
          </Typography>
          <div className="flex items-center gap-3 w-full justify-start">
            <Link
              href={createLink("player", creator.nickname)}
              className="flex items-center border border-neutral-800 p-1 rounded-lg gap-1"
            >
              <Avatar
                nickname={creator.nickname}
                url={creator.avatar}
                className="w-5 h-5"
              />
              <Typography>
                {creator.nickname}
              </Typography>
            </Link>
            <div className="flex items-center border border-neutral-800 p-1 rounded-lg gap-1">
              <ToLink
                link={createLink("news", id)}
              />
              <EditButton
                onClick={() => actions.createLinkValue(ctx, { parent: "news", type: "edit", target: id.toString() })}
              />
              <DeleteButton
                onClick={() => deleteNews.deleteBefore(ctx, { id, title })}
                disabled={ctx.spy(deleteNews.submit.statusesAtom).isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, "NewsListItem")

const NewsList = reatomComponent(({ ctx }) => {
  useUpdate(newsList.fetch, [])

  if (ctx.spy(newsList.fetch.statusesAtom).isPending) return <Skeleton className="h-16 w-full" />

  const data = ctx.spy(newsList.fetch.dataAtom)?.data;
  if (!data) return null;

  return (
    <div className="flex flex-col w-full gap-2 h-full">
      {data.map(news => <NewsListItem key={news.id} {...news} />)}
    </div>
  )
}, "NewsList")

const VARIANTS: Record<ActionType, ReactNode> = {
  "create": <CreateNewsForm />,
  "edit": <EditNewsForm />,
  "view": <NewsList />
}

export const NewsWrapper = reatomComponent(({ ctx }) => {
  if (!ctx.spy(getSelectedParentAtom("news"))) return VARIANTS["view"]
  return VARIANTS[ctx.spy(actionsState.type)]
}, "NewsWrapper")

export const ViewNews = () => <ToActionButtonX title="Создать" parent="news" type="create" />
export const CreateNews = () => {
  return (
    <div className="flex items-center gap-1">
      <ToActionButtonX parent="news" type="create" />
      <CreateNewsSubmit />
    </div>
  )
}
export const EditNews = () => {
  return (
    <div className="flex items-center gap-1">
      <ToActionButtonX parent="news" type="edit" />
      <EditNewsSubmit />
    </div>
  )
}
