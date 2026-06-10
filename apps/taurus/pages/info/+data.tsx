import { useConfig } from 'vike-solid/useConfig';
import type { PageContextServer } from 'vike/types';
import { getUrl } from '@/shared/lib/helpers';

export const data = async (pageCtx: PageContextServer) => {
  const config = useConfig()

  config({
    Head: (
      <>
        <link rel="canonical" href={getUrl(pageCtx)} />
        <meta property="og:url" content={getUrl(pageCtx)} />
      </>
    )
  })
}
