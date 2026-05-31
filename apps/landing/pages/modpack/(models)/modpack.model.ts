import { action, atom, sleep, withAssign } from '@reatom/framework';
import { withReset } from '@reatom/framework';

export type Modpacks = ExtractApiData<"getModpackList">["data"]
export type Modpack = Modpacks[number]

export const modpacksState = atom(null, "modpacksState").pipe(
  withAssign((_, name) => ({
    item: atom<Modpack | null>(null, `${name}.item`).pipe(withReset()),
    isOpen: atom(false, `${name}.isOpen`),
    list: atom<Modpacks>([], `${name}.list`)
  }))
)

export const modpacks = atom(null, "modpacks").pipe(
  withAssign((_, name) => ({
    open: action((ctx, id: Modpack["id"]) => {
      const data = ctx.get(modpacksState.list);
      if (!data) throw new Error("Modpacks is not defined")

      const modpack = data.find(target => target.id === id)
      if (!modpack) throw new Error("Modpack is not defined");

      modpacksState.item(ctx, modpack);
      modpacksState.isOpen(ctx, true);
    }, `${name}.open`)
  }))
)

modpacksState.isOpen.onChange(async (ctx, state) => {
  if (!state) {
    await sleep(150)
    modpacksState.item.reset(ctx)
  }
})
