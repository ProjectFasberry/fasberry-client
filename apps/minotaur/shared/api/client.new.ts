// import createClient, { type ClientOptions } from "openapi-fetch";
// import type { paths as mainClientPaths } from "../types/gen/api/main.schema";
// import type { paths as panelClientPaths } from "../types/gen/api/panel.schema";
// import { env } from "../env";

// const baseOptions: ClientOptions = {
//   credentials: "include",
//   headers: {
//     "x-forwarded-for": import.meta.env.DEV ? env.VITE_FORWARDED_FOR : undefined
//   }
// }

// const mainClient = createClient<mainClientPaths>({
//   ...baseOptions,
//   baseUrl: env.VITE_API_URL,
// });

// const panelClient = createClient<panelClientPaths>({
//   ...baseOptions,
//   baseUrl: env.VITE_PANEL_API_URL,
// });
