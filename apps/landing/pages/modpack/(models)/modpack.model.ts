import { atom, withAssign } from '@reatom/framework';

export type Modpacks = ExtractApiData<"getModpackList">["data"]
export type Modpack = Modpacks[number]

export const modpacksState = atom(null, "modpacksState").pipe(
  withAssign((_, name) => ({
    list: atom<Modpacks>([], `${name}.list`)
  }))
)

export const modpacks = atom(null, "modpacks").pipe(
  withAssign((_, name) => ({

  }))
)
