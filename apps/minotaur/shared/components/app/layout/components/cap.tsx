import { env } from "@/shared/env";
import { pof } from "@/shared/models/shared.model";
import { dialogVariant } from "@/shared/ui/dialog";
import { IconLoader } from "@/shared/ui/icon-loader";
import { Noop } from "@/shared/ui/noop";
import { Typography } from "@/shared/ui/typography";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { CapWidget } from "@better-captcha/react/provider/cap-widget";
import { reatomComponent } from "@reatom/npm-react";

const getCapUrl = () => `${env.VITE_CAP_URL}/${env.VITE_CAP_SITE_KEY}/`;

const CAP_OPTIONS = {
  i18nInitialState: "Я человек",
  i18nVerifyingLabel: "Проверка...",
  i18nVerifyingAriaLabel: "Проверка...",
  i18nVerifiedAriaLabel: "Пройдено",
  i18nVerifyAriaLabel: "Пройти",
  i18nErrorAriaLabel: "Ошибка",
  i18nErrorLabel: "Ошибка",
  i18nWasmDisabled: "У вас отключен WASM",
  i18nSolvedLabel: "Пройдено",
}

const CapWidgetWrapper = reatomComponent(({ ctx }) => {
  const data = ctx.spy(pof.cb);
  if (!data) return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Noop title="ничего нет" />
      <Typography color="gray" className="text-sm font-semibold">
        Возможно это ошибка
      </Typography>
      {import.meta.env.DEV && (
        <button onClick={() => pof.cb(ctx, {})}>
          test
        </button>
      )}
    </div>
  )

  const { onSolve, onError, onReady } = data;

  return (
    <CapWidget
      endpoint={getCapUrl()}
      options={CAP_OPTIONS}
      onSolve={(value) => onSolve?.(value)}
      onError={(e) => onError?.(e)}
      onReady={() => onReady?.()}
    />
  )
}, "CapWidgetWrapper")

export const Cap = reatomComponent(({ ctx }) => {
  return (
    <Dialog.Root open={ctx.spy(pof.isOpen)}>
      <Portal>
        <Dialog.Backdrop className={dialogVariant.backdrop()} />
        <Dialog.Positioner className={dialogVariant.positioner()}>
          <Dialog.Content className={dialogVariant.content({ className: "bg-transparent!" })}>
            <CapWidgetWrapper />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}, "Cap")
