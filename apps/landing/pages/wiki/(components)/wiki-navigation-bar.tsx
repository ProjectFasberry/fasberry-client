import { Link } from "@/shared/components/link";
import { Accordion } from "@ark-ui/solid/accordion";
import { Skeleton } from "@/shared/ui/skeleton";
import { Typography } from "@/shared/ui/typography";
import { getIsActiveAtom, wikiCategories, wikiState } from "./wiki.model";
import { ClientOnly } from "vike-solid/ClientOnly";
import { useAtom } from "@reatom/npm-solid-js";
import { createSignal, For, Index, Match, Show, Switch } from "solid-js";
import { Icon } from "@/shared/ui/icon";
import { Drawer, DrawerContent, DrawerTrigger } from "@/shared/ui/drawer";
import { accordionItemContentVariant, accordionItemTriggerVariant, accordionItemVariant, accordionRootVariant } from "@/shared/ui/accordion";
import { atom } from "@reatom/framework";
import { pageState } from "@/shared/models/global.model";

const BarTrigger = (p: { value: string, title: string, onClick?: () => void }) => {
  const [isActiveAtom] = useAtom(getIsActiveAtom(p.value));

  return (
    <Link
      href={`/wiki/${p.value}`}
      onClick={p.onClick}
      data-state={isActiveAtom() ? "true" : "false"}
      class="tr"
    >
      <Typography class="text-base text-left">&nbsp;&nbsp;{p.title}</Typography>
    </Link>
  )
}

const accordionState = {
  nodes: atom<string[]>([], "accordionState.nodes")
}

wikiCategories.fetch.onFulfill.onCall((ctx) => {
  const data = ctx.get(wikiState.categories);
  if (data.length === 0) return;

  const firstThree = data.slice(0, 3).map(([d]) => d);
  accordionState.nodes(ctx, (state) => [...state, ...firstThree])
})

const NavigationList = (p: { handle?: () => void }) => {
  const [dataAtom] = useAtom(wikiState.categories)
  const [statusesAtom] = useAtom(wikiCategories.fetch.statusesAtom);
  const [accordionNodesAtom, setAccordionNodesAtom] = useAtom(accordionState.nodes);
  const [isClientAtom] = useAtom(pageState.isClient);

  return (
    <Show
      when={isClientAtom() && !statusesAtom().isPending}
      fallback={<NavigationBarSkeleton />}
    >
      <Show when={dataAtom()}>
        {(data) => (
          <div class="flex flex-col w-full gap-12 p-4 h-full">
            <div class="flex flex-col gap-6 w-full h-full">
              <Accordion.Root
                multiple={true}
                collapsible
                value={accordionNodesAtom()}
                onValueChange={(details) => setAccordionNodesAtom(details.value)}
                class={accordionRootVariant()}
              >
                <For each={data()}>
                  {([key, { title, isChilded, nodes }]) => (
                    isChilded ? (
                      <Accordion.Item value={key} class={accordionItemVariant()}>
                        <Accordion.ItemTrigger class={accordionItemTriggerVariant({ class: "px-0 py-2 group" })}>
                          <Typography class="text-lg">{title}</Typography>
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent class={accordionItemContentVariant({ class: "flex gap-1 w-full h-full" })}>
                          <div class="w-1 mt-1 bg-neutral-800" />
                          <div class="flex flex-col gap-0.5 h-full w-full">
                            <For each={nodes}>
                              {(item) => <BarTrigger onClick={p.handle} {...item} />}
                            </For>
                          </div>
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    ) : (
                      <Link
                        href={`/wiki/${key}`}
                        onClick={p.handle}
                        class="tr"
                      >
                        <Typography class="text-lg">{title}</Typography>
                      </Link>
                    )
                  )}
                </For>
              </Accordion.Root>
            </div>
            <div class="flex flex-col gap-y-2">
              <Typography class="text-xl">Прочее</Typography>
              <Link href="/modpack">Сборки модов</Link>
            </div>
          </div>
        )}
      </Show>
    </Show>
  )
}

const NAV = [{ type: "button", icon: "sprite:arrow-left" }, { type: "drawer", icon: "sprite:category" }] as const;
const btnClass = "focus:scale-[1.05] w-6 aspect-square cursor-pointer"

const NavDrawer = (props: { icon: typeof NAV[number]["icon"] }) => {
  const [open, setOpen] = createSignal(false);

  return (
    <Drawer open={open()} onOpenChange={v => setOpen(v)}>
      <DrawerTrigger class={btnClass}>
        <Icon name={props.icon} />
      </DrawerTrigger>
      <ClientOnly>
        <DrawerContent class="xl:hidden">
          <Drawer.Label class="text-xl text-center">Навигация</Drawer.Label>
          <div class="max-h-[80vh] overflow-y-auto">
            <NavigationList handle={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </ClientOnly>
    </Drawer>
  );
};

const NavButton = (props: { icon: typeof NAV[number]["icon"] }) => (
  <button class={btnClass} onClick={() => window.history.back()}>
    <Icon name={props.icon} />
  </button>
);

const WikiNavigationMobile = () => {
  return (
    <Index each={NAV}>
      {(item) => (
        <Switch>
          <Match when={item().type === 'drawer'}>
            <NavDrawer icon={item().icon} />
          </Match>
          <Match when={item().type === 'button'}>
            <NavButton icon={item().icon} />
          </Match>
        </Switch>
      )}
    </Index>
  )
}

const NavigationBarSkeleton = () => {
  return (
    <div class="flex flex-col gap-8 p-4 w-full">
      <Skeleton class="h-8 w-4/5" />
      <div class="flex flex-col gap-2 w-full h-full">
        <Skeleton class="h-8 w-2/3" />
        <div class="flex flex-col items-start gap-1 w-full h-full px-2">
          <Skeleton class="h-7 w-4/5" />
          <Skeleton class="h-7 w-28" />
          <Skeleton class="h-7 w-16" />
          <Skeleton class="h-7 w-20" />
          <Skeleton class="h-7 w-2/3" />
          <Skeleton class="h-7 w-24" />
          <Skeleton class="h-7 w-20" />
          <Skeleton class="h-7 w-32" />
          <Skeleton class="h-7 w-28" />
          <Skeleton class="h-7 w-28" />
          <Skeleton class="h-7 w-16" />
          <Skeleton class="h-7 w-2/4" />
          <Skeleton class="h-7 w-28" />
        </div>
      </div>
      <Skeleton class="h-8 w-1/2" />
      <Skeleton class="h-8 w-3/4" />
      <Skeleton class="h-8 w-36" />
    </div>
  )
}

export const WikiNavigation = () => {
  return (
    <>
      <div class="card hidden xl:flex flex-col p-0 min-h-[80vh] w-full xl:w-[25%] items-start sticky top-2">
        <NavigationList />
      </div>
      <div class="xl:hidden flex items-center justify-between
        fixed bottom-4 left-1/2 right-0 px-4 -translate-x-1/2 gap-6 h-12 max-h-12 w-fit z-30 rounded-xl bg-neutral-700/60 backdrop-blur-md"
      >
        <WikiNavigationMobile />
      </div>
    </>
  )
}
