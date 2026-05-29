import { NewsSingle } from "@/shared/components/app/news/components/news-single";
import { newsSingleState } from "@/shared/components/app/news/models/news-single.model";
import { createPageModel } from "@/shared/lib/events";
import { useAtom } from "@reatom/npm-react";

const page = createPageModel({
  name: "news-single",
  onDisconnAction: (ctx) => {
    newsSingleState.data.reset(ctx)
    newsSingleState.editParams.reset(ctx)
  }
})

export default function Page() {
  const [_] = useAtom(page.dataAtom);

  return <NewsSingle />
}
