import { useConfig } from 'vike-solid/useConfig';
import type { PageContextServer } from 'vike/types';
import { getUrl, wrapTitle } from '@/shared/lib/helpers';
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'
import { editorExtensions as extensions } from '@/shared/components/editor.model';
import { translate } from '@/shared/locales/helpers';
import { mainClient } from '@/shared/api/client';
import type { JSONContent } from '@tiptap/core'

export type Data = Awaited<ReturnType<typeof data>>

export async function data(pageCtx: PageContextServer) {
  const config = useConfig();

  const categoryResult = await mainClient
    .GET(`/wiki/category/{name}`, {
      params: { path: { name: pageCtx.routeParams.category } },
      headers: pageCtx.headers ?? undefined
    })
    .then(r => r.data?.data ?? null)

  if (!categoryResult) {
    const title = translate["pages.wiki.not-found"]()

    config({
      title,
      Head: (
        <>
          <link rel="canonical" href={getUrl(pageCtx)} />
          <meta property="og:url" content={getUrl(pageCtx)} />
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )
    })
    return {
      data: null
    };
  }

  const title = wrapTitle(`${categoryResult.title}`);
  const markdown = renderToMarkdown({
    extensions, content: categoryResult.content as JSONContent
  })
  const description = markdown.slice(0, 128) + '...'

  config({
    title,
    Head: (
      <>
        <link rel="canonical" href={getUrl(pageCtx)} />
        <meta property="og:url" content={getUrl(pageCtx)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </>
    )
  })

  return {
    data: categoryResult
  }
}
