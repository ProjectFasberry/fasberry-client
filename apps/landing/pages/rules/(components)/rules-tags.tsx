import { For, Show } from "solid-js";
import { useData } from "vike-solid/useData";
import type { Data } from "../+data";

export const RulesTags = () => {
  const data = useData<Data>()?.data.tags

  return (
    <Show when={data}>
      {(data) => (
        <For each={data()}>
          {(item) => (
            <div class="flex panel-dark items-center text-xs md:text-base lg:text-md px-2">
              {item.title.toLowerCase()}
            </div>
          )}
        </For>
      )}
    </Show>
  )
}
