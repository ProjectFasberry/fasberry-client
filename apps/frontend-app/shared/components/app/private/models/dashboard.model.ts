import { client } from '@/shared/lib/client-wrapper'
import { atom, reatomAsync, reatomMap, withDataAtom, withRetry } from '@reatom/framework'

export const formatBytesToMB = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 MB';
  return `${parseFloat((bytes / (1024 * 1024)).toFixed(decimals))} MB`;
};
export const formatUptimeLong = (seconds: number) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d > 0) parts.push(`${d}д`);
  if (h > 0 || d > 0) parts.push(`${h}ч`);
  parts.push(`${m}м`);
  parts.push(`${s}с`);
  return parts.join(' ');
}

type HealthPayload = ExtractApiData<"getHealth">["data"]

export const healthHistory = reatomMap<number, HealthPayload | null>(new Map());
const lastHistoryTimestamp = atom<number>(0);
export const lastHistory = atom((ctx) => ctx.spy(healthHistory).get(ctx.get(lastHistoryTimestamp)) ?? null)

export const healthFetch = reatomAsync(async (ctx) => {
  return await client<HealthPayload>("health").exec()
}, {
  onFulfill: (ctx, res) => {
    const timestamp = Date.now();

    lastHistoryTimestamp(ctx, timestamp)
    healthHistory.set(ctx, timestamp, res)

    if (ctx.get(healthHistory.sizeAtom) > 50) {
      const oldestKey = ctx.get(healthHistory).keys().next().value;
      if (oldestKey !== undefined) healthHistory.delete(ctx, oldestKey);
    }
  }
}).pipe(
  withDataAtom(),
  withRetry()
)
