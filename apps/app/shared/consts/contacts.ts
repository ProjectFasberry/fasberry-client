import { getApiMiscRoute } from "../lib/utils";

// TODO: migrate the static config to a server-side
export const CONTACTS = [
  {
    title: "Telegram",
    value: "tg",
    img: "https://cristalix.gg/content/icons/tg.svg",
    color: "bg-[#007CBD]",
    href: getApiMiscRoute("telegram"),
  },
  {
    title: "VK",
    value: "vk",
    img: "https://cristalix.gg/content/icons/vk.svg",
    color: "bg-[#0b5aba]",
    href: getApiMiscRoute("vk"),
  },
  {
    title: "Discord",
    value: "ds",
    img: "https://cristalix.gg/content/icons/discord.svg",
    color: "bg-[#5865F2]",
    href: getApiMiscRoute("discord"),
  }
]
