import { reatomComponent } from "@reatom/npm-react";
import { msg, msgState } from "../../models/chat.model";
import { Input } from "@/shared/ui/input";
import { Icon } from "@/shared/ui/icon"
import { Button } from "@/shared/ui/button";
import { spawn } from "@reatom/framework";

export const ChatCreateMessage = reatomComponent(({ ctx }) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    spawn(ctx, (spawnCtx) => msg.create.submit(spawnCtx))
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-1 justify-between inert:opacity-50 inert:pointer-events-none w-full"
      inert={ctx.spy(msg.create.submit.statusesAtom).isPending}
    >
      <Input
        value={ctx.spy(msgState.create.msg)}
        onChange={e => msgState.create.msg(ctx, e.target.value)}
        maxLength={2025}
        placeholder="Напишите что-нибудь"
        className="h-10 w-full"
      />
      <Button
        type="submit"
        background="default"
        className="h-10 min-w-10 min-h-10 w-10 p-0 *:size-4"
        disabled={!ctx.spy(msgState.create.msg)}
      >
        {ctx.spy(msg.create.submit.statusesAtom).isPending
          ? <Icon name="sprite:loader-2" className='animate-spin duration-150 ease-in-out' />
          : <Icon name="sprite:brand-telegram" />
        }
      </Button>
    </form>
  )
}, "ChatCreateMessage")
