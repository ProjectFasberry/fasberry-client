import { type BuildEnvironmentOptions, defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import svg from '@neodx/svg/vite';
import tsconfigPaths from 'vite-tsconfig-paths'
import path from "node:path"
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { visualizer } from "rollup-plugin-visualizer";

type Stage = "staging" | "prod"

type StageOpts = Partial<BuildEnvironmentOptions> & Partial<{
  chunksHashing: boolean,
  chunksGroping: boolean,
  visualizer: boolean
}>

const STAGES: Partial<Record<Stage, StageOpts>> = {
  "staging": {
    sourcemap: true,
    minify: "esbuild",
    chunksHashing: true,
    chunksGroping: true,
    visualizer: true
  },
  "prod": {
    sourcemap: false,
    minify: "esbuild",
    chunksHashing: false,
    chunksGroping: true,
    visualizer: false
  }
}

const CHUNK_GROUPS = [
  { name: 'lib', matches: ['reatom', 'zod', 'ky', '@scure'] },
  { name: 'editor', matches: ['@monaco-editor', 'tiptap'] },
  { name: 'ui-old', matches: ['embla-carousel', '@radix-ui', "floating-ui", 'vaul', '@monaco-editor', 'number-flow'] },
  { name: "dev", matches: ["tweakpane"] },
  { name: "setting-base", matches: ["@yudiel/react-qr-scanner"] },
  { name: "captcha", matches: ["@better-captcha"] },
  { name: "ui-new", matches: ["@zag-js", "ark-ui"] }
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) as ImportMetaEnv;
  const host = env.VITE_APP_HOST ?? "0.0.0.0"
  const port = Number(env.VITE_APP_PORT)

  const stage = process.env["STAGE"] as Maybe<Stage>
  const stageOpts: StageOpts = stage ? (STAGES[stage] ?? {}) : {};

  let isSSR = false;

  const {
    chunksGroping, chunksHashing, visualizer: visualizerIsEnabled,
    ...stageBuildOpts
  } = stageOpts;

  return {
    logLevel: 'info',
    plugins: [
      vike(),
      react(),
      tailwindcss(),
      tsconfigPaths({
        ignoreConfigErrors: true
      }),
      svg({
        inputRoot: 'assets/svg',
        output: 'public/sprites',
        fileName: '{name}.{hash:8}.svg',
        metadata: 'shared/sprite.gen.ts',
        resetColors: false
      }),
      {
        name: "log",
        configResolved(resolvedConfig) {
          isSSR = !!resolvedConfig.build.ssr;
        },
        buildStart() {
          if (!isSSR && process.env.NODE_ENV === 'production') {
            console.log(`Build for stage: ${stage}`, stageOpts)
          }
        }
      },
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./paraglide",
        strategy: ["url", "baseLocale"]
      }),
      visualizerIsEnabled && visualizer({
        filename: "dist/bundleStats.html",
        template: "treemap",
        gzipSize: true
      }),
    ],
    ssr: {
      noExternal: process.env.NODE_ENV === 'production' || undefined
    },
    build: {
      ...stageBuildOpts,
      emptyOutDir: true,
      target: "esnext",
      rollupOptions: {
        output: {
          chunkFileNames: chunksHashing ? 'assets/[name]-[hash].js' : undefined,
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('@scure/bip39/wordlists/english.js')) return 'english-wordlist';

            if (chunksGroping) {
              for (const group of CHUNK_GROUPS) {
                if (group.matches.some(match => id.includes(match))) {
                  return group.name;
                }
              }
            }

            const parts = id.split('node_modules/');
            const pathParts = parts[parts.length - 1]?.split('/');

            if (pathParts) {
              const part = pathParts[0]

              if (part) {
                const name = part.startsWith('@')
                  ? `${part}/${pathParts[1]}`
                  : part

                return name.split('@')[0];
              }
            }
          }
        }
      }
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        "@": new URL("./", import.meta.url).pathname,
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        consola: mode === 'production' ? path.resolve(__dirname, './shared/lib/noop.ts') : 'consola',
      },
    },
    preview: {
      host,
      port,
      allowedHosts: true
    },
    server: {
      host,
      port,
      allowedHosts: true
    },
  }
});
