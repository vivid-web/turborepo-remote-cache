import { fileURLToPath } from "node:url";

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type { PrettierConfig | TailwindConfig } */
const config = {
	useTabs: true,
	plugins: [import("prettier-plugin-tailwindcss")],
	tailwindStylesheet: fileURLToPath(
		new URL("../../apps/web/src/styles/app.css", import.meta.url),
	),
	tailwindFunctions: ["cn", "cva"],
};

export default config;
