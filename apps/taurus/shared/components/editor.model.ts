import StarterKit from "@tiptap/starter-kit"
import Image from '@tiptap/extension-image'
import { TextStyleKit } from "@tiptap/extension-text-style"
import { TableKit } from "@tiptap/extension-table";
import { env } from "@/shared/env";

const ALLOWED_DOMAINS = [
  'google.com',
  'github.com',
  'stackoverflow.com',
  'wikipedia.org',
  'mozilla.org',
  'apple.com',
  'amazon.com',
  'linkedin.com',
  'discord.gg',
  env.VITE_MAIN_DOMAIN,
  env.PUBLIC_ENV__API_URL,
  env.VITE_VOLUME_URL
];

const domainPattern = ALLOWED_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|');

const isHostnameAllowed = (rawHostname: string) => {
  if (!rawHostname || typeof rawHostname !== 'string') return false;
  return ALLOWED_HOSTNAME_RE.test(rawHostname.trim().toLowerCase());
}

const ALLOWED_HOSTNAME_RE = new RegExp(
  `^(?:[a-z0-9-]+\\.)*(?:${domainPattern})$`, 'i'
);

export const editorExtensions = [
  TextStyleKit,
  Image.configure({
    resize: {
      enabled: true,
      directions: ['top', 'bottom', 'left', 'right'],
      minWidth: 50,
      minHeight: 50,
      alwaysPreserveAspectRatio: true,
    }
  }),
  TableKit.configure({
    table: {
      resizable: true
    },
  }),
  StarterKit.configure({
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https'],
      isAllowedUri: (url, ctx) => {
        try {
          const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`)

          if (!ctx.defaultValidate(parsedUrl.href)) return false

          const disallowedProtocols = ['ftp', 'file', 'mailto']
          const protocol = parsedUrl.protocol.replace(':', '')

          if (disallowedProtocols.includes(protocol)) return false

          const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

          if (!allowedProtocols.includes(protocol)) return false
          if (!isHostnameAllowed(parsedUrl.hostname)) return false;

          return true
        } catch {
          return false
        }
      },
      shouldAutoLink: (url) => {
        try {
          const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`https://${url}`);

          return isHostnameAllowed(parsedUrl.hostname)
        } catch {
          return false
        }
      },
    }
  }),
]
