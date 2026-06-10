import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";
import { usePageContext } from "vike-react/usePageContext";

type LinkProps = ComponentPropsWithRef<"a"> & {
  href: string,
  locale?: string
}

export const Link = ({ href, locale, className, ...props }: LinkProps) => {
  const { urlPathname: pathname, ...pageCtx } = usePageContext()

  const targetLocale = locale ?? pageCtx.locale;
  const initWithLocale = !!locale;

  let finalHref = href.startsWith('/') ? href : `/${href}`;

  if (targetLocale !== "ru") {
    finalHref = `/${targetLocale}${finalHref === '/' ? '' : finalHref}`;
  }

  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = finalHref.replace(/\/$/, "") || "/";

  const isActive = normalizedPathname === normalizedHref;
  const isIdentity = pathname === finalHref;

  return (
    <a
      href={finalHref}
      data-state={isActive ? "active" : "inactive"}
      style={isIdentity && !initWithLocale ? { pointerEvents: 'none' } : {}}
      onClick={(e) => {
        if (isIdentity && !initWithLocale) {
          e.preventDefault();
        }
      }}
      className={tv({ base: `data-[state=active]:is-active` })({ className })}
      {...props}
    />
  );
}
