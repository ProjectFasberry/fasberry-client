import { ClientOnly } from "vike-solid/ClientOnly"
import { Toaster as ToasterInit } from 'solid-sonner'
import { getStaticObject } from "@/shared/lib/helpers"

const imgSrc = getStaticObject("minecraft/icons", "book_big.webp")

const icons = {
  info: <img width={32} height={32} alt="" loading="lazy" draggable={false} src={imgSrc} />,
  error: <img width={32} height={32} alt="" loading="lazy" draggable={false} src={imgSrc} />,
  success: <img width={32} height={32} alt="" loading="lazy" draggable={false} src={imgSrc} />,
  warning: <img width={32} height={32} alt="" loading="lazy" draggable={false} src={imgSrc} />
}

export const Toaster = () => {
  return (
    <ClientOnly>
      <ToasterInit
        position="top-left"
        richColors
        icons={icons}
      />
    </ClientOnly>
  )
}
