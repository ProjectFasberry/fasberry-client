import { Icon, type IconProps } from "@/shared/ui/icon"

export const IconLoader = (props?: Partial<IconProps>) => {
  return <Icon name="sprite:loader-2" {...props} className="animate-spin text-neutral-500 duration-200" />
}
