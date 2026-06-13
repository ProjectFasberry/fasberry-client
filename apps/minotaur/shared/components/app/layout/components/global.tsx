import { reatomComponent } from "@reatom/npm-react";
import { lazy } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { Widgets } from "../../widgets/components/widgets";
import { userState } from "@/shared/models/app/index.model";

const Settings = lazy(() => import("@/shared/components/app/settings/components/settings").then(d => ({ default: d.Settings })))
const Toaster = lazy(() => import("@/shared/components/config/toaster").then(d => ({ default: d.Toaster })))
const AlertDialog = lazy(() => import("@/shared/components/config/alert-dialog/alert-dialog").then(d => ({ default: d.AlertDialog })))
const Cap = lazy(() => import("./cap").then(d => ({ default: d.Cap })))

export const Global = reatomComponent(({ ctx }) => {
  const isAuthed = ctx.spy(userState.isAuthed)

  return (
    <ClientOnly>
      <Widgets />
      <AlertDialog />
      {isAuthed && <Settings />}
      <Toaster />
      <Cap />
    </ClientOnly>
  )
}, "Global")
