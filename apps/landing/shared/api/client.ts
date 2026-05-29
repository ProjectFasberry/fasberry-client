import ky from "ky";
import { env } from "../env";

export const client = ky.extend({
  prefixUrl: env.PUBLIC_ENV__API_URL,
  credentials: "include"
})
