import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@/shared/ui/button"
import { widgetsState } from "../models/widgets.model"
import { Icon } from "@/shared/ui/icon"
import { Typography } from "@/shared/ui/typography"

export const AuthWidgetActions = reatomComponent(({ ctx }) => {
  const current = ctx.spy(widgetsState.current);
  if (!current) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        className="bg-neutral-50 px-2"
        onClick={() => current.onAction(ctx)}
      >
        <Icon name="sprite:arrow-right" className="size-5 sm:hidden inline text-neutral-950" />
        <Typography className="hidden sm:inline text-neutral-950 font-semibold text-sm">
          Авторизоваться
        </Typography>
      </Button>
      <Button
        className="bg-neutral-700 px-2"
        onClick={() => current.onHide(ctx)}
      >
        <Icon name="sprite:x" className="size-5 sm:hidden inline" />
        <Typography className="hidden text-nowrap sm:inline font-semibold text-sm">
          Не показывать
        </Typography>
      </Button>
    </div>
  )
}, "AuthWidgetActions")
