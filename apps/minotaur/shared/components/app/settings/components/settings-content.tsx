import { reatomComponent } from "@reatom/npm-react"
import { settingsState } from "../models/settings.model"
import { lazy, type JSX } from "react"
import { SettingsAccount } from "./settings-account"
import { SettingsNavigationMobile } from "./settings-navigation"
import { SettingsLanguage } from "./settings-language"

const SettingsDevices = lazy(() => import("./settings-devices").then(m => ({ default: m.SettingsDevices })))
const SettingsStore = lazy(() => import("./settings-store").then(m => ({ default: m.SettingsStore })))
const SettingsSecurity = lazy(() => import("./settings-security").then(m => ({ default: m.SettingsMainSecurity })))
const SettingsConnections = lazy(() => import("./settings-connections").then(m => ({ default: m.SettingsMainConnections })))
const SettingsAppearance = lazy(() => import("./settings-appearance").then(m => ({ default: m.SettingsAppearance })))

const SETTINGS_NODES: Partial<Record<string, Record<string, typeof SettingsAppearance | (() => JSX.Element)>>> = {
  main: {
    account: SettingsAccount,
    devices: SettingsDevices,
    security: SettingsSecurity,
    connections: SettingsConnections,
    store: SettingsStore
  },
  app: {
    appearance: SettingsAppearance,
    language: SettingsLanguage
  }
}

export const SettingsContentMobile = reatomComponent(({ ctx }) => {
  const child = ctx.spy(settingsState.target)?.child;
  if (!child) return <SettingsNavigationMobile />

  const parent = ctx.spy(settingsState.target).parent;
  const Component = SETTINGS_NODES[parent]?.[child];

  return Component ? <Component/> : null;
}, "SettingsContentMobile")

export const SettingsContentDesktop = reatomComponent(({ ctx }) => {
  const child = ctx.spy(settingsState.target)?.child;
  if (!child) return null;

  const parent = ctx.spy(settingsState.target).parent
  const node = SETTINGS_NODES[parent]
  if (!node) return null;

  const Component = node[child];
  return Component ? <Component /> : null;
}, "SettingsContent")
