import { env } from "@/shared/env";
import { getStaticObject } from "@/shared/lib/helpers";
import { atom, withAssign } from "@reatom/framework";

const APP_URL = env.VITE_APP_URL

export const logoImage = getStaticObject("minecraft", "static/fasberry_logo.webp")
export const expImage = getStaticObject("minecraft", "icons/experience_big.webp")

export const MAIN_HEADER = [
  { name: "Главная", href: "/", },
  { name: "Правила", href: "/rules", },
  { name: "Поддержка", href: "/support", },
  { name: "Галерея", href: "/gallery", },
  {
    name: "Игра",
    childs: [
      { name: "Аккаунт", href: APP_URL, },
      { name: "Карта мира", href: `${APP_URL}/map`, },
      { name: "Вики", href: "/wiki", },
      { name: "Модпак", href: "/modpack", },
    ],
  },
];

export const headerDrawerState = atom(null, "headerDrawerState").pipe(
  withAssign((_, name) => ({
    isOpen: atom(false, `${name}.isOpen`)
  }))
)
