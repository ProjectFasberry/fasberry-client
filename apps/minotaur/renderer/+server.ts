import type { Server } from "vike/types";
import Elysia from "elysia";
import vike from "@vikejs/elysia";
import compress from '@universal-middleware/compress'
import { paraglideMiddleware } from "@/paraglide/server"
import consola from "consola";
import { env } from "@/shared/env";
import { sentry } from "@/shared/sentry";

await sentry.init({ variant: "server" })

const app = new Elysia()
  .get("/health", ({ status }) => status(200))
  .derive(async ({ request }) => {
    let locale = "ru";
    let modifiedRequest = request;

    await paraglideMiddleware(request, ({ request: newRequest, locale }) => { modifiedRequest = newRequest; locale })

    return {
      request: modifiedRequest,
      locale
    }
  })

const appState = {
  runtime: typeof Bun !== 'undefined' ? 'bun' : 'node',
  port: process.env.VITE_APP_PORT,
  env
}

consola.box({
  title: " App ",
  message: `
Runtime: ${appState.runtime}
Port: ${appState.port}
Stage: ${process.env.STAGE}
Env: ${JSON.stringify(appState.env, null, 2)}
Routes: \n${app.routes.map((r) => "- " + r.method + "" + r.path).join("\n")}
  `
})

vike(app, [compress()]);

export default {
  fetch: app.fetch
} satisfies Server;
