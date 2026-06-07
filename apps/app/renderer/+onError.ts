import { sentry } from '@/shared/sentry'
import type { Config } from 'vike/types'

export const onError: Config['onError'] = (error) => {
  if (!import.meta.env.PROD) return

  sentry.getServer().captureException(error)
}
