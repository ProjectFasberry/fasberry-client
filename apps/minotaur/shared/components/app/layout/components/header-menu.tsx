import { appState } from "@/shared/models/app/index.model";
import { Vaul, VaulContent, VaulTrigger } from "@/shared/ui/vaul";
import { Menu, type MenuItemProps } from "@ark-ui/react/menu";
import { reatomComponent } from "@reatom/npm-react";
import {
  createMenuActions,
  type MenuActionItem as MenuActionItemType,
  headerUserMenuIsOpenAtom,
  validatedLinksAtom,
  type MenuLink,
} from "../models/navigation.model";
import { menuVariant } from "@/shared/ui/menu";
import { Icon, type IconName } from "@/shared/ui/icon";
import { Separator } from "@/shared/ui/separator";
import { action } from "@reatom/framework";
import { currentUserState } from "@/shared/models/current-user/index.model";
import { createLink } from "@/shared/components/config/link/link.model";
import { Link } from "@/shared/components/config/link/link";
import { Avatar } from "@/shared/ui/avatar";
import { navigate } from "vike/client/router";
import { Typography } from "@/shared/ui/typography";
import clsx from "clsx";

const ITEM_VARIANT = ["menu", "drawer"] as const;;
type ItemVariant = typeof ITEM_VARIANT[number];

const MenuActionItem = reatomComponent<MenuActionItemType & { variant: ItemVariant }>(({
  ctx, label, cb, variant, disabled, className
}) => {
  const { Item, itemProps } = defineItem(variant, {
    onClick: () => cb(ctx),
    className: clsx("gap-2 w-full font-semibold text-base", className),
    disabled: disabled?.(ctx) ?? false,
    value: label
  })

  return <Item {...itemProps} data-sound={true}>{label}</Item>
}, "MenuActionItem")

const MenuCurrentUser = reatomComponent<{ variant: ItemVariant }>(({ ctx, variant }) => {
  const currentUser = ctx.spy(currentUserState);
  if (!currentUser) return null;

  const { Item, itemProps } = defineItem(variant, {
    className: "flex gap-2 items-center min-h-10 select-none cursor-pointer rounded-lg p-2 bg-neutral-800 w-full overflow-hidden",
    onClick: () => navigate(createLink("player", currentUser.nickname)),
    value: "current-user"
  })

  return (
    <Item {...itemProps}>
      <Avatar
        nickname={currentUser.nickname}
        url={currentUser.avatar}
        className="min-w-10 w-10"
      />
      <div className="flex flex-col justify-center items-start w-full h-10">
        <Typography className="text-sm text-neutral-50 font-semibold leading-4 truncate">
          {currentUser.nickname.slice(0, 32)}
        </Typography>
        <Typography className="text-neutral-400 leading-4 text-sm truncate">
          игрок
        </Typography>
      </div>
    </Item>
  )
}, "MenuCurrentUser")

function defineItem<T extends ItemVariant>(variant: T, props: MenuItemProps) {
  const Item = variant === 'drawer' ? "div" : Menu.Item
  return {
    Item,
    itemProps: { ...props, className: menuVariant.item({ className: props?.className }) }
  };
}

const MenuLinkItem = reatomComponent<MenuLink & { idx: number, variant: ItemVariant }>(({
  ctx, variant, type, title, idx, href
}) => {
  const data = ctx.spy(validatedLinksAtom)
  const firstPrivatedIdx = data.findIndex(link => link.type === 'privated')
  const lastPrivatedIdx = data.map(link => link.type).lastIndexOf('privated')
  const showSepartor = type === 'privated' && idx;

  const { Item, itemProps } = defineItem(variant, {
    className: "font-semibold text-base",
    onClick: () => navigate(href),
    value: href
  })

  return (
    <>
      {showSepartor === firstPrivatedIdx && <Separator className="my-2" />}
      <Item {...itemProps} data-sound={true}>{title}</Item>
      {showSepartor === lastPrivatedIdx && <Separator className="my-2" />}
    </>
  )
}, "MenuLinkItem")

const UserCurrentTrigger = reatomComponent(({ ctx }) => {
  const currentUser = ctx.spy(currentUserState);
  if (!currentUser) return null;

  return (
    <Link
      href={createLink("player", currentUser.nickname)}
      className="flex items-center gap-2 h-8 overflow-hidden"
    >
      <Avatar
        nickname={currentUser.nickname} url={currentUser.avatar} className="min-w-8 w-8"
      />
    </Link>
  )
}, "UserCurrentTrigger")

const syncState = action((ctx) => (el: Nullable<HTMLDivElement>) => {
  if (!el) return;

  const sub = ctx.subscribe(headerUserMenuIsOpenAtom, (state) => {
    el.dataset.active = String(state)
  });

  return sub;
})

const USER_MENU_TRIGGER_ICONS: { icon: IconName, value: boolean }[] = [
  { icon: "sprite:x", value: true }, { icon: "sprite:menu-2", value: false }
];

const UserMenuTrigger = reatomComponent(({ ctx }) => {
  const initial = ctx.get(headerUserMenuIsOpenAtom);

  return (
    <div
      data-active={initial}
      className="
        flex items-center justify-center group hover:bg-neutral-800
        bg-neutral-900 text-neutral-400 rounded-lg cursor-pointer h-8 w-8
      "
      ref={syncState(ctx)}
    >
      {USER_MENU_TRIGGER_ICONS.map(({ icon: iconName, value }, idx) => (
        <Icon
          name={iconName}
          key={idx}
          data-sound={true}
          className={`size-5 absolute duration-300 opacity-0 ${value
            ? "group-data-[active=true]:opacity-100" : "group-data-[active=false]:opacity-100"
            }`}
        />
      ))}
    </div>
  )
}, "UserMenuTrigger")

const UserMenuContent = reatomComponent<{ variant: ItemVariant }>(({ ctx, variant }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <MenuCurrentUser variant={variant} />
      <Separator className="my-2" />
      {ctx.spy(validatedLinksAtom).map((link, idx) => (
        <MenuLinkItem variant={variant} key={link.href} idx={idx} {...link} />)
      )}
      {createMenuActions().map((action, idx) => (
        <MenuActionItem variant={variant} key={idx} {...action} />
      ))}
    </div>
  )
}, "UserMenuContent")

const UserMenuVaul = () => {
  return (
    <Vaul openAtom={headerUserMenuIsOpenAtom}>
      <VaulTrigger>
        <UserMenuTrigger />
      </VaulTrigger>
      <VaulContent>
        <UserMenuContent variant="drawer" />
      </VaulContent>
    </Vaul>
  )
}

const UserMenuDropdown = reatomComponent(({ ctx }) => {
  return (
    <Menu.Root
      open={ctx.spy(headerUserMenuIsOpenAtom)}
      positioning={{ placement: "bottom-end" }}
      onOpenChange={(details) => headerUserMenuIsOpenAtom(ctx, details.open)}
    >
      <Menu.Trigger className={menuVariant.trigger()}>
        <UserMenuTrigger />
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className={menuVariant.content({ className: "min-w-[240px]" })}>
          <Menu.Arrow className={menuVariant.arrow()}>
            <Menu.ArrowTip className={menuVariant.arrowTip()} />
          </Menu.Arrow>
          <UserMenuContent variant="menu" />
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}, "UserMenuDropdown");

export const UserMenu = reatomComponent(({ ctx }) => {
  return (
    <div className="flex items-center w-fit gap-2 max-h-10 overflow-hidden min-w-0 h-10 px-2">
      <UserCurrentTrigger />
      {ctx.spy(appState.current.isMobile) ? <UserMenuVaul /> : <UserMenuDropdown />}
    </div>
  )
}, "UserMenu")
