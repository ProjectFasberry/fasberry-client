import { type PageContextServer } from "vike/types";
import { useConfig } from "vike-react/useConfig";
import { wrapTitle } from "@/shared/lib/utils";
import { logRouting } from "@/shared/lib/log";
import { player, playerSsrModel } from "@/shared/components/app/player/models/player.model";;
import dayjs from "@/shared/lib/create-dayjs"
import { DONATE_GROUPS, DONATE_TITLE } from "@/shared/consts";
import { createCtx } from "@reatom/framework";
import { playerLands } from "@/shared/components/app/player/models/player-lands.model";
import { snapshots } from "@/shared/models/ssr";

export type Player = ExtractApiData<"getServerPlayerByNickname">["data"]
export type Data = Awaited<ReturnType<typeof data>>;

function buildMetadataValues(user: Player, pageCtx: PageContextServer) {
  const nickname = user.nickname;
  const reg = dayjs(user.meta.reg_date.toString()).format("DD MMM YYYY");
  const login = dayjs(user.meta.login_date.toString()).format("DD MMM YYYY");

  return {
    title: wrapTitle(nickname),
    image: user.avatar ?? "",
    description: `
      Профиль игрока ${nickname}.
      Привилегия: ${DONATE_TITLE[user.group as keyof typeof DONATE_GROUPS]}.
      Играет с ${reg}. Последний вход: ${login}.
    `,
    url: pageCtx.urlPathname,
    nickname
  };
}

function buildMetadataHead({ title, nickname, description, image, url }: ReturnType<typeof buildMetadataValues>) {
  const keywords = `${nickname}, fasberry, fasberry page, профиль ${nickname}`

  return (
    <>
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && (
        <>
          <link rel="preload" as="image" href={image} fetchPriority="high" />
        </>
      )}
      <meta name="keywords" content={keywords} />
    </>
  );
}

export async function data(pageCtx: PageContextServer) {
  const config = useConfig();

  logRouting(pageCtx.urlPathname, "data");

  const ctx = createCtx()
  const result = await player.init(ctx, pageCtx)
  const metaValues = buildMetadataValues(result, pageCtx);

  config({
    title: metaValues.title,
    image: metaValues.image,
    description: metaValues.description,
    Head: buildMetadataHead(metaValues)
  });

  await playerLands.init(ctx, pageCtx);

  pageCtx.snapshot = snapshots.merge(ctx, pageCtx, playerSsrModel.snapshotAtom)
}
