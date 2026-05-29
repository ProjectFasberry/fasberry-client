import { tv } from "tailwind-variants";

const accordionRootVariant = tv({
  base: `
    flex [--px:4px] [--py:4px] w-full
    data-[orientation=vertical]:flex-col data-[orientation=vertical]:max-h-[calc(100vh-16px)]
  `
})
const accordionItemVariant = tv({
  base: `
    data-[orientation=vertical]:block
    data-[orientation=horizontal]:flex
  `
})
const accordionItemTriggerVariant = tv({
  base: `
    flex items-center justify-between gap-2 m-0 text-start leading-[1.5] outline-none
    focus-visible:outline focus-visible:outline-neutral-50
  `
})
const accordionItemIndicatorVariant = tv({
  base: `

  `
})
const accordionItemContentVariant = tv({
  base: `
  accordion-item-content
  `
})

export {
  accordionItemTriggerVariant,
  accordionRootVariant,
  accordionItemVariant,
  accordionItemIndicatorVariant,
  accordionItemContentVariant
}
