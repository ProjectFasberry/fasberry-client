import type { Server } from "vike/types";
import Elysia from "elysia";
import vike from "@vikejs/elysia";
import compress from '@universal-middleware/compress'
import { paraglideMiddleware } from "@/paraglide/server"
import consola from "consola";
import { env } from "@/shared/env";

const app = new Elysia()
  .derive(async ({ request }) => {
    let modifiedRequest = request
    let locale = "ru";

    await paraglideMiddleware(request, ({ request: newRequest, locale }) => { modifiedRequest = newRequest; locale })

    return {
      request: modifiedRequest,
      locale
    }
  })

consola.success(`Started server`, {
  runtime: typeof Bun === 'undefined' ? 'nodejs' : 'bun',
  port: process.env.PORT,
  env
})

vike(app, [compress()]);

export default {
  fetch: app.fetch
} satisfies Server;
