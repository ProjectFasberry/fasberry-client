import type { Rec } from "@reatom/framework";
import type { PersistRecord } from "@reatom/persist";
import type { Locale } from "./shared/locales";
import type { JSXElement } from "solid-js";
import 'solid-js';

declare global {
  namespace Vike {
    interface PageContext {
      snapshot: Rec<PersistRecord<unknown>>,
      Page: () => JSXElement,
      locale: Locale,
    }
  }

  type PaginatedMeta = {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    endCursor?: string,
    startCursor?: string
  }

  type WrappedResponse<T> = { data: T } | { error: string };

  type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]
  type Maybe<T> = T | undefined
}

declare module 'solid-js' {
  namespace JSX {
    interface SvgSVGAttributes<T> {
      focusable?: boolean | string;
    }
  }
}

export { }
