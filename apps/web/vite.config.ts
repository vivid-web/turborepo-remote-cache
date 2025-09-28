import netlify from "@netlify/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

	return {
		server: {
			port: 3000,
		},
		build: {
			sourcemap: true,
		},
		plugins: [
			tsConfigPaths(),
			tanstackStart({
				srcDirectory: "./src",
				start: { entry: "./start.ts" },
				client: { entry: "./entry.client.tsx" },
				server: { entry: "./entry.server.ts" },
			}),
			react(),
			tailwindcss(),
			sentryVitePlugin({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
				telemetry: false,
			}),
			netlify({
				build: {
					enabled: process.env.NETLIFY === "true",
				},
			}),
		],
	};
});
