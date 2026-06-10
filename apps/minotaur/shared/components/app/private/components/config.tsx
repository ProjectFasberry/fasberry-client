import { newsSection } from "./news"
import { actionsState, type ActionParent, type ActionType } from "../models/actions.model"
import type { ReactNode } from "react"
import { bannersSection } from "./banners"
import { dictionariesSection } from "./dictionaries"
import { eventsSection } from "./events"
import { reatomComponent } from "@reatom/npm-react"
import { WithHeader, SectionWrapper } from "./ui"
import { Roles } from "./roles"
import { Methods } from "./methods"
import { Options } from "./options"
import { atom } from "@reatom/framework"
import { modpackSection } from "./modpack"
import { landsSection } from "./lands"
import { apiKeysSection } from "./api"

type ComponentType = Nullable<() => ReactNode>;

const COMPONENTS: Record<string, Partial<Record<ActionType, ComponentType>>> = {
  "news": {
    "create": newsSection.Header.Create,
    "edit": newsSection.Header.Edit,
    "view": newsSection.Header.View
  },
  "modpack": {
    "create": modpackSection.Header.Create,
    "edit": modpackSection.Header.Edit,
    "view": modpackSection.Header.View
  },
  "event": {
    "create": eventsSection.Header.Create,
    "edit": eventsSection.Header.Edit,
    "view": eventsSection.Header.View,
  },
  "banner": {
    "create": bannersSection.Header.Create,
    "edit": bannersSection.Header.Edit,
    "view": bannersSection.Header.View,
  },
  "dictionaries": {
    "create": dictionariesSection.Header.Create,
    "edit": dictionariesSection.Header.Edit,
    "view": dictionariesSection.Header.View,
  },
  "lands": {
    "create": landsSection.Header.Create,
    "edit": landsSection.Header.Edit,
    "view": landsSection.Header.View,
  },
  "api": {
    "create": apiKeysSection.Header.Create,
    "edit": apiKeysSection.Header.Edit,
    "view": apiKeysSection.Header.View
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
          <WithHeader title="Глобальные параметры" />
          <Options />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <WithHeader title="Платежные методы" />
          <Methods />
        </div>
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-1 w-full h-full">
        <WithHeader title="Роли" />
        <Roles />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-1 w-full h-fulll">
        <WithHeader title="Ивенты">
          <ActionsHeaderSlot parent="event" />
        </WithHeader>
        <eventsSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Модпаки">
          <ActionsHeaderSlot parent="modpack" />
        </WithHeader>
        <modpackSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Баннеры">
          <ActionsHeaderSlot parent="banner" />
        </WithHeader>
        <bannersSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Новости" >
          <ActionsHeaderSlot parent="news" />
        </WithHeader>
        <newsSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Справочник">
          <ActionsHeaderSlot parent="dictionaries" />
        </WithHeader>
        <dictionariesSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="API Ключи">
          <ActionsHeaderSlot parent="api" />
        </WithHeader>
        <apiKeysSection.Wrapper />
      </SectionWrapper>
      <SectionWrapper className="flex flex-col gap-2 w-full h-full">
        <WithHeader title="Регионы">
          <ActionsHeaderSlot parent="lands" />
        </WithHeader>
        <landsSection.Wrapper />
      </SectionWrapper>
    </div>
  )
}
