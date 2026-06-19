import type { CreateSvgSpriteBuilderParams } from "@neodx/svg";

export const SVG_OPTIONS: CreateSvgSpriteBuilderParams = {
  inputRoot: '../../packages/assets/svg',
  output: 'public/sprites',
  fileName: '{name}.{hash:8}.svg',
  resetColors: false,
  metadata: "shared/types/gen/icon/sprite.gen.ts"
}
