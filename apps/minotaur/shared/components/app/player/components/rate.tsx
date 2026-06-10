import { reatomComponent } from "@reatom/npm-react"
import { Button } from "@/shared/ui/button"
import { Icon } from "@/shared/ui/icon"
import { tv } from "tailwind-variants"
import { isIdentityAtom, player, playerState, wrapAsClientSideAtom, type PlayerRatePayload } from "../models/player.model"
import { navigate } from "vike/client/router"
import { Skeleton } from "@/shared/ui/skeleton"

const rateButtonVariant = tv({
  slots: {
    base: "flex border-2 group rounded-full duration-150 px-3 py-1 *:duration-150 items-center gap-2",
    child: "size-6"
  },
  variants: {
    parentVariant: {
      inactive: { base: "border-neutral-700" },
      active: { base: "border-red-600/90 bg-red/70 backdrop-blur-md" },
      filled: { base: "bg-neutral-50 active:scale-100" }
    },
    childVariant: {
      default: "",
      rated: { child: "group-data-[state=rated]:fill-neutral-50 group-data-[state=rated]:text-neutral-50" },
      filled: { child: "group-data-[state=filled]:text-neutral-900 group-data-[state=filled]:fill-neutral-900" }
    }
  },
  defaultVariants: {
    parentVariant: "inactive",
    childVariant: "default"
  }
});

type RateButtonProps = PlayerRatePayload & { nickname: string }

const RateSelf = reatomComponent<Pick<RateButtonProps, "count" | "nickname">>(({ ctx, count, nickname }) => {
  const { base, child } = rateButtonVariant({ parentVariant: "filled" });

  return (
    <Button
      data-state="filled"
      disabled={ctx.spy(player.rate.submit.statusesAtom).isPending}
      onClick={() => navigate(`/player/${nickname}/rates`)}
      className={base()}
    >
      <Icon name="sprite:heart" className={child()} />
      <span className={child()}>{count}</span>
    </Button>
  )
}, "RateSelf")

const RateOther = reatomComponent<RateButtonProps>(({ ctx, isRated, count, nickname }) => {
  const parentVariant = isRated ? "active" : "inactive"
  const childVariant = isRated ? "rated" : "default"

  const { base, child } = rateButtonVariant({ parentVariant });

  return (
    <Button
      data-state={isRated ? "rated" : "unrated"}
      disabled={ctx.spy(player.rate.submit.statusesAtom).isPending}
      onClick={() => player.rate.submit(ctx, nickname)}
      className={base()}
    >
      <Icon name="sprite:heart" className={child({ childVariant })} />
      <span className={child({ childVariant })}>{count}</span>
    </Button>
  )
}, "RateOther")

export const Rate = reatomComponent(({ ctx }) => {
  const nickname = ctx.spy(playerState.nickname);

  const isLoading = ctx.spy(wrapAsClientSideAtom(!nickname))
  if (isLoading) return <Skeleton className="h-16 w-24" />

  const rate = ctx.spy(playerState.rate)
  if (!rate || !nickname) return null;

  if (ctx.spy(isIdentityAtom)) {
    return <RateSelf count={rate.count} nickname={nickname} />
  }

  return <RateOther nickname={nickname} {...rate} />
}, "Rate")
