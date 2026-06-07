import { type Action, type Atom, atom, type AtomMut, type Ctx, onConnect, onDisconnect, withReset } from "@reatom/framework";
import { LOGGING } from "../models/devtools/debug";
import { logger } from "./logger";

type WithReset<T> = AtomMut<T | null> & {
  reset: Action<[], T | null>;
}

type Page = {
  unsubscribe: () => void
}

type PageHandler<Args extends any[] = []> = (ctx: Ctx, atom: WithReset<Page>, ...args: Args) =>
  Promise<void> | void;

type PageModelConfig<TSpy> = {
  name: string;
  hooks?: Partial<{
    onConnect: PageHandler<[isConnected: () => boolean]>;
    onDisconnect: PageHandler;
    onAfterDisconnect: PageHandler;
  }>
} & (
  | { spyedAtom: Atom<TSpy>; hooks?: { onSpy: PageHandler<[payload: TSpy]> } }
  | { spyedAtom?: never; hooks?: { onSpy?: never } }
  )

const pageLogger = logger.withTag("Page");

export const createPageModel = <TSpy = unknown>({
  name, hooks, spyedAtom
}: PageModelConfig<TSpy>) => {
  const dataAtom = atom<Nullable<Page>>(null, `${name}.page`).pipe(withReset());

  onConnect(dataAtom, (ctx) => {
    if (LOGGING.page) {
      pageLogger.info(`${name}.page connected`)
    }

    return hooks?.onConnect?.(ctx, dataAtom, ctx.isConnected)
  });

  onDisconnect(dataAtom, (ctx) => {
    if (LOGGING.page) {
      pageLogger.info(`${name}.page disconnected`)
    }

    const pageData = ctx.get(dataAtom);

    hooks?.onAfterDisconnect?.(ctx, dataAtom);

    pageData?.unsubscribe?.()
    dataAtom.reset(ctx)

    hooks?.onAfterDisconnect?.(ctx, dataAtom)
  })

  if (spyedAtom && hooks?.onSpy) {
    spyedAtom.onChange((ctx, payload) => hooks.onSpy(ctx, dataAtom, payload))
  }

  return { dataAtom }
}

export const listenBackOnce = (cb: () => void) => {
  window.history.pushState({ active: true }, '');

  const handler = () => {
    cb();
    window.removeEventListener('popstate', handler);
  };

  window.addEventListener('popstate', handler);

  return () => {
    window.removeEventListener('popstate', handler);
  };
};
