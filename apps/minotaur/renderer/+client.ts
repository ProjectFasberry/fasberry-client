import { sentry } from "@/shared/sentry";

await sentry.init({ variant: "browser" });

window.addEventListener('error', (e) => {
  if (!import.meta.env.PROD) return

  sentry.getBrowser().captureException(e);
})
