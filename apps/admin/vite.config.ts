import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

function getTarget() {
	if (process.env.NETLIFY === "true") {
		return "netlify";
	}

	return "node-server";
}

export default defineConfig({
	server: {
		port: 3000,
	},
	build: {
		sourcemap: true,
	},
	plugins: [
		tsConfigPaths(),
		tanstackStart({ customViteReactPlugin: true, target: getTarget() }),
		react(),
		tailwindcss(),
		sentryVitePlugin({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
			telemetry: false,
		}),
	],
});
