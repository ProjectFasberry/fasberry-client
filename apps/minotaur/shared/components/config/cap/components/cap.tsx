import { dialogVariant } from "@/shared/ui/dialog";
import { Noop } from "@/shared/ui/noop";
import { Typography } from "@/shared/ui/typography";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { CapWidget } from "@better-captcha/react/provider/cap-widget";
import { reatomComponent } from "@reatom/npm-react";
import { getCapUrl, pof } from "../models/cap.model";

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

const CapWidgetError = ({ callback }: { callback: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Noop title="ничего нет" />
      <Typography color="gray" className="text-sm font-semibold">
        Возможно это ошибка
      </Typography>
      {import.meta.env.DEV && (
        <button onClick={callback}>
          Повторить
        </button>
      )}
    </div>
  )
}

const CapWidgetWrapper = reatomComponent(({ ctx }) => {
  const data = ctx.spy(pof.data);

  if (!data) {
    return (
      <CapWidgetError callback={() => { }} />
    )
  }

  const { cb: { onSolve, onError, onReady }, withProgress } = data;

  return (
    <CapWidget
      endpoint={getCapUrl()}
      options={{
        ...CAP_OPTIONS,
        onprogress: (e) => {
          if (withProgress) {
            console.log(e.detail.progress)
          }
        },
      }}
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
          <Dialog.Content className={dialogVariant.content("bg-transparent!")}>
            <CapWidgetWrapper />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}, "Cap")
