import { SKIP_HOOK_HEADER } from '../../api/client';
import { action, atom } from "@reatom/framework";
import { withAssign, withReset } from "@reatom/framework";
import { clientInstance } from "../../api/client";
import { parseWrappedJson } from '../../lib/client-wrapper';
import { withSsr } from "../ssr";
import { invariant } from '@/shared/lib/invariant';

export type MePayload = ExtractApiData<"getMe">['data'];

export const CURRENT_USER_KEY = 'currentUser' as const
export const CONFIG_PANEL_READ_PERMISSION = "config.panel.read"

export const currentUserState = atom<MePayload | null>(null, "currentUser").pipe(
  withAssign((target, name) => ({
    perms: atom((ctx) =>
      ctx.spy(target)?.meta.permissions ?? [],
      `${name}.perms`
    ),
    role: atom((ctx) => {
      const role = ctx.spy(target)?.meta.role
      if (!role) return null;

      return {
        id: role.id,
        name: role.name
      }
    }, `${name}.role`),
  })
  ),
  withReset(),
  withSsr(CURRENT_USER_KEY)
)
export const currentUser = atom(null, "currentUser").pipe(
  withAssign(() => ({
    getNickname: action((ctx) => {
      const nickname = ctx.get(currentUserState)?.nickname;
      invariant(nickname, "Current user nickname is not defined");
      return nickname;
    })
  }))
)

export async function getMe(init: RequestInit) {
  const headers = {
    ...init.headers,
    [SKIP_HOOK_HEADER]: "true"
  }

  const res = await clientInstance("me", {
    ...init,
    headers,
    throwHttpErrors: false,
    retry: 0
  })

  return parseWrappedJson<MePayload>(res)
}
