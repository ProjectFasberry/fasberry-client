import type { AtomMut, Ctx } from "@reatom/framework"
import { DEBUG_MODULES } from "./debug"

type ConfigItemMeta<T> =
  | { applyAs: "atom", applyTarget: AtomMut<T> }
  | { applyAs: "static", applyTarget?: never, onChange?: (ctx: Ctx, value: T) => void }
  | { applyAs: "dynamic", applyTarget?: never }

export type ConfigItem<T = unknown> = {
  value: T, __meta: ConfigItemMeta<T>
}

export type DevtoolsConfig = {
  [K: string]: ConfigItem<any> | DevtoolsConfig;
};

const createConfig = <T extends DevtoolsConfig>(config: T): T => config;

/** Helper for defining the item if types is broken */
const defineItem = <T>(item: ConfigItem<T>) => item;

const loggingConfig = createConfig({
  "Snapshots": {
    value: true,
    __meta: { applyAs: "static" }
  },
  "Atoms": {
    value: true,
    __meta: { applyAs: "static" }
  },
  "Actions": {
    value: true,
    __meta: { applyAs: "static" }
  }
})

const globalConfig = createConfig({
  "Flags": {
    "react-scan": defineItem({
      value: false,
      __meta: {
        applyAs: "static",
        onChange: (_, val) => val ? DEBUG_MODULES[0].activate() : DEBUG_MODULES[0].deactivate()
      }
    })
  }
})

export const devtoolsConfig = {
  "Logging": loggingConfig,
  "Global": globalConfig
} satisfies Record<string, DevtoolsConfig>;
