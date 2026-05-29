import { SVG_OPTIONS } from '@/shared/consts/svg';
import { createSvgSpriteBuilder } from '@neodx/svg';
import util from 'node:util';

const builder = createSvgSpriteBuilder(SVG_OPTIONS);

await builder.load('**/*.svg');
const result = await builder.build();

console.log(
  "Success build\n",
  util.inspect(
    Object.entries(
      result[0].assets[0].symbols.map(d => [d.name])
    ),
    { depth: null, colors: true }
  )
);
