import { editorExtensions as extensions } from "@/shared/components/editor.model";
import { renderToHTMLString } from "@tiptap/static-renderer";
import { For, Show } from "solid-js";
import { dayjs } from "@/shared/lib/create-dayjs";
import { Typography } from "@/shared/ui/typography";
import type { Data } from "../+data";
import { useData } from "vike-solid/useData";

const RuleItem = (props: { content: any }) => {
  const html = renderToHTMLString({ extensions, content: props.content });
  return <div innerHTML={html} class="tiptap whitespace-pre-wrap" />
}

export const Rules = () => {
  const data = useData<Data>()?.data.content

  return (
    <Show
      when={data}
      fallback={
        <Typography class="text-2xl text-neutral-400">
          Не удалось получить список правил
        </Typography>
      }
    >
      {(data) => (
        <For each={data()}>
          {(item) => (
            <div class="transparent-achievement-panel lg:gap-4 p-2 lg:p-4 flex flex-col gap-4 w-full h-full">
              <Typography class="text-xl font-semibold">
                {item.category}
              </Typography>
              <RuleItem content={item.content} />
              <Show when={item.updated_at}>
                {(data) => (
                  <div class="flex items-center w-full justify-end">
                  <Typography
                    title={dayjs(data().toString()).format("DD.MM.YYYY hh:mm")}
                    class="text-neutral-400"
                  >
                    Обновлено: {dayjs(data().toString()).fromNow()}
                    </Typography>
                  </div>
                )}
              </Show>
            </div>
          )}
        </For>
      )}
    </Show>
  );
}
