import { useConfig } from 'vike-solid/useConfig';
import type { PageContextServer } from 'vike/types';
import { getUrl, getStaticObject, wrapTitle } from '@/shared/lib/helpers';
import { wrapClient } from '@/shared/lib/api';
import { client } from '@/shared/api/client';

const bgImage = getStaticObject("background", "main_background.png")

const description = `
  Ознакомьтесь с правилами нашего Fasberry-сервера, чтобы обеспечить честную и дружелюбную игру для всех участников.
  Уважайте других игроков и следуйте установленным нормам поведения.`
const descriptionMore = `
  Правила нашего Fasberry-сервера для комфортной игры.
  Соблюдайте установленные нормы и поддерживайте дружелюбную атмосферу!
`

export type Data = Awaited<ReturnType<typeof data>>

export async function data(pageCtx: PageContextServer) {
  const config = useConfig()

  const headers = pageCtx.headers;
  if (!headers) return;

  const [tags, content] = await Promise.all([
    wrapClient<ExtractApiData<"getRulesTags">["data"]>(() => client("rules/tags", { headers })),
    wrapClient<ExtractApiData<"getRulesList">["data"]>(() => client("rules/list", { headers })),
  ])

  config({
    title: wrapTitle(`Правила`),
    description,
    Head: (
      <>
        <link rel="canonical" href={getUrl(pageCtx)} />
        <meta property="og:url" content={getUrl(pageCtx)} />
        <meta property="og:title" content="Правила Fasberry" />
        <meta property="og:description" content={descriptionMore} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Правила Fasberry" />
        <meta property="og:image" content={bgImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content="Правила Fasberry" />
        <meta name="twitter:description" content={descriptionMore} />
        <meta name="twitter:image" content={bgImage} />
        <meta property="twitter:image:type" content="image/jpeg" />
        <meta property="twitter:image:width" content="1200" />
        <meta property="twitter:image:height" content="630" />
      </>
    )
  })

  return {
    data: {
      tags,
      content
    }
  }
}
