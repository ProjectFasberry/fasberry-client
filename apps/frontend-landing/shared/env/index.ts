// import * as z from "zod"

// const envSchema = z.object({
//   VITE_LANDING_ENDPOINT: z.string(),
//   VITE_VOLUME_URL: z.string(),
//   PUBLIC_ENV__TG_NAME: z.string(),
//   PUBLIC_ENV__API_URL: z.string(),
//   VITE_APP_URL: z.string(),
//   VITE_MAIN_DOMAIN: z.string(),
//   VITE_SUPPORT_EMAIL: z.string()
// })
// export const env = envSchema.parse(import.meta.env)

export const env = {
  VITE_LANDING_ENDPOINT: import.meta.env.VITE_LANDING_ENDPOINT!,
  VITE_VOLUME_URL: import.meta.env.VITE_VOLUME_URL!,
  PUBLIC_ENV__TG_NAME: import.meta.env.PUBLIC_ENV__TG_NAME!,
  PUBLIC_ENV__API_URL: import.meta.env.PUBLIC_ENV__API_URL!,
  VITE_APP_URL: import.meta.env.VITE_APP_URL!,
  VITE_MAIN_DOMAIN: import.meta.env.VITE_MAIN_DOMAIN!,
  VITE_SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL!
}
