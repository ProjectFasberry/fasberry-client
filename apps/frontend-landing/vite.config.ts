import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import vike from "vike/plugin";
import path from "node:path";
import vikeSolid from "vike-solid/vite";
import svg from '@neodx/svg/vite';
import { cloudflare } from '@cloudflare/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer';

type Stage = "prod" | "dev";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const stage = process.env["STAGE"] as Maybe<Stage>
  const isProd = stage === 'prod';

  console.log(`Building for stage ${stage}`);

  return {
    plugins: [
      vike(),
      vikeSolid(),
      cloudflare({
        viteEnvironment: {
          name: 'ssr'
        }
      }),
      tailwindcss(),
      svg({
        inputRoot: 'assets/svg',
        output: 'public/sprites',
        fileName: '{name}.{hash:8}.svg',
        metadata: 'shared/sprite.gen.ts',
        resetColors: false
      }),
      !isProd && visualizer({
        filename: 'dist/bundle-stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    ],
    build: {
      target: "esnext",
      outDir: "dist",
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'lib',
                test: /node_modules\/(reatom|zod|ky|@reatom)(\/|$)/,
                priority: 10
              },
              {
                name: 'editor',
                test: /node_modules\/(tiptap|@tiptap)(\/|$)/,
                priority: 10
              },
              {
                name: 'framework',
                test: /node_modules\/solid-js(\/|$)/,
                priority: 10
              }
            ]
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
      tsconfigPaths: true
    },
    ssr: {
      noExternal: process.env.NODE_ENV === 'production' || undefined
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "replace-css-env",
            Once(root) {
              root.walkDecls((decl) => {
                if (decl.value.includes("_VOLUME_URL")) {
                  decl.value = decl.value.replaceAll("_VOLUME_URL", env.VITE_VOLUME_URL);
                }
              });
            },
          },
        ],
      },
    },
  };
});
