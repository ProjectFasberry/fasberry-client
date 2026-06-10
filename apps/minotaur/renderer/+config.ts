import { aliases } from "@/shared/components/config/link/aliases";
import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
	title: "Fasberry",
	extends: [vikeReact],
	reactStrictMode: false,
	passToClient: ["snapshot", "locale"],
	ssr: false,
	redirects: {
		...aliases
	},
} satisfies Config;
