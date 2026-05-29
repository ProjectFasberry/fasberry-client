import { Typography } from "@/shared/ui/typography"
import { CreateNews, EditNews, NewsWrapper, ViewNews } from "./news"
import { actionsState, type ActionParent, type ActionType } from "../models/actions.model"
import type { ReactNode } from "react"
import { BannersWrapper, CreateBanner, EditBanner, ViewBanner } from "./banners"
import { CreateDictionaries, DictionariesWrapper, ViewDictionaries } from "./dictionaries"
import { CreateEvent, EventsWrapper, ViewEvent } from "./events"
import { reatomComponent } from "@reatom/npm-react"
import { WithHeader, SectionWrapper } from "./ui"
import { Roles } from "./roles"
import { Methods } from "./methods"
import { Options } from "./options"
import { atom } from "@reatom/framework"

type ComponentType = Nullable<() => ReactNode>;

const COMPONENTS: Record<string, Partial<Record<ActionType, ComponentType>>> = {
  "news": {
    "create": CreateNews,
    "edit": EditNews,
    "view": ViewNews
  },
  "event": {
    "create": CreateEvent,
    "edit": null,
    "view": ViewEvent,
  },
  "banner": {
    "create": CreateBanner,
    "edit": EditBanner,
    "view": ViewBanner,
  },
  "dictionaries": {
    "create": CreateDictionaries,
    "edit": null,
    "view": ViewDictionaries,
  }
}

const actionsHeaderComponentAtom = (parent: ActionParent) => atom((ctx): ComponentType => {
  const targetParent = ctx.spy(actionsState.parent)
  if (!targetParent) return COMPONENTS[parent]?.view ?? null

  if (parent !== targetParent) return null;

  const targetType = ctx.spy(actionsState.type);
  return COMPONENTS[parent][targetType] ?? null
})

const ActionsHeaderSlot = reatomComponent<{ parent: ActionParent }>(({ ctx, parent }) => {
  const Component = ctx.spy(actionsHeaderComponentAtom(parent));
  if (!Component) return null;
  return <Component />
}, "ActionsHeaderSlot")

export const Config = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <SectionWrapper className="flex flex-col sm:flex-row gap-2 sm:items-stretch h-full w-full">
        <div className="flex flex-col gap-1 w-full">
          <Typography className="text-lg font-bold">Глобальные параметры</Typography>
          <Options />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <Typography className="text-lg font-bold">Платежные методы</Typography>
          <Methods />
        </div>
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-1 w-full h-full">
        <Typography className="text-lg font-bold">Роли</Typography>
        <Roles />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-1 w-full h-fulll">
        <WithHeader title="Ивенты">
          <ActionsHeaderSlot parent="event" />
        </WithHeader>
        <EventsWrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Баннеры">
          <ActionsHeaderSlot parent="banner" />
        </WithHeader>
        <BannersWrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Новости" >
          <ActionsHeaderSlot parent="news" />
        </WithHeader>
        <NewsWrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Справочник">
          <ActionsHeaderSlot parent="dictionaries" />
        </WithHeader>
        <DictionariesWrapper />
      </SectionWrapper>
    </div>
  )
}
