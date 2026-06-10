import { useAtom, useCtx } from "@reatom/npm-solid-js";
import { pageState } from "@/shared/models/global.model";
import { tv } from "tailwind-variants";
import { For, Show } from "solid-js";
import { Accordion } from "@ark-ui/solid/accordion";
import { Typography } from "@/shared/ui/typography";
import { expImage, MAIN_HEADER, headerDrawerState } from "./header.model";
import { accordionItemContentVariant, accordionItemTriggerVariant, accordionItemVariant, accordionRootVariant } from "../ui/accordion";

const ExperienceCircle = () => {
  return (
    <img
      src={expImage}
      loading="lazy"
      width={16}
      height={16}
      alt=""
      draggable={false}
    />
  )
}

const itemVariant = tv({
  base: `flex border-2 border-neutral-600 hover:bg-neutral-600 group bg-neutral-800 rounded-md gap-6 py-2 px-2 w-full`
})

export const HeaderDrawerContent = () => {
  const ctx = useCtx();
  const [urlParsedAtom] = useAtom(pageState.urlParsed)

  const pathname = () => urlParsedAtom()?.pathname;

  const handleToPage = (href?: string) => {
    if (!href) return;
    headerDrawerState.isOpen(ctx, state => !state);
  };

  return (
    <div class="flex flex-col items-center justify-center w-full gap-2">
      <For each={MAIN_HEADER}>
        {(item) => (
          <Show
            when={item.childs}
            fallback={
              <Show when={item.href}>
                {(href) => (
                  <a
                    href={href()}
                    onClick={() => handleToPage(href())}
                    class={itemVariant()}
                  >
                    <div class="flex items-center gap-1">
                      <Show when={href() === pathname()}>
                        <ExperienceCircle />
                      </Show>
                      <Typography>{item.name}</Typography>
                    </div>
                  </a>
                )}
              </Show>
            }
          >
            {(data) => (
              <Accordion.Root
                multiple={false}
                collapsible
                defaultValue={[item.name]}
                class={accordionRootVariant()}
              >
                <Accordion.Item value={item.name} class={accordionItemVariant()}>
                  <Accordion.ItemTrigger
                    class={accordionItemTriggerVariant({ class: itemVariant() })}
                  >
                    <Show when={item.href === pathname()}>
                      <ExperienceCircle />
                    </Show>
                    <Typography>{item.name}</Typography>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent class={accordionItemContentVariant({ class: "flex gap-1 pt-1" })}>
                    <div class="w-[2px] mt-1 bg-neutral-700" />
                    <div class="flex flex-col gap-2 w-full">
                      <For each={data()}>
                        {(item) => (
                          <a
                            href={item.href}
                            onClick={() => handleToPage(item.href)}
                            class={itemVariant()}
                          >
                            <div class="flex items-center gap-1">
                              <Show when={item.href === pathname()}>
                                <ExperienceCircle />
                              </Show>
                              <Typography>{item.name}</Typography>
                            </div>
                          </a>
                        )}
                      </For>
                    </div>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            )}
          </Show>
        )}
      </For>
    </div>
  )
}
