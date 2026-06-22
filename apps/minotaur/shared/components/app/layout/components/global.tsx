import { lazy } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { Widgets } from "../../widgets/components/widgets";

const Settings = lazy(() => import("@/shared/components/app/settings/components/settings").then(d => ({ default: d.Settings })))
const Toaster = lazy(() => import("@/shared/components/config/toaster").then(d => ({ default: d.Toaster })))
const AlertDialog = lazy(() => import("@/shared/components/config/alert-dialog/alert-dialog").then(d => ({ default: d.AlertDialog })))
const Cap = lazy(() => import("../../../config/cap/components/cap").then(d => ({ default: d.Cap })))

export const Global = () => {
  return (
    <ClientOnly>
      <Widgets />
      <AlertDialog />
      <Settings />
      <Toaster />
      <Cap />
    </ClientOnly>
  )
}
