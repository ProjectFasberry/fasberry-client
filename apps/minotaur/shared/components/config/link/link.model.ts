export const LINKS = (target: string | number) => ({
  "land": `/lands/${target}`,
  "player": `/player/${target}`,
  "news": `/news/${target}`,
  "store": `/store/i/${target}`
})

export const createLink = (type: keyof ReturnType<typeof LINKS>, target: string | number) => LINKS(target)[type]
