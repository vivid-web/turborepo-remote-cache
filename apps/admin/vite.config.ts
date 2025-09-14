import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				rewrite: (path) => path.replace(/^\/api/, ""),
				changeOrigin: true,
				secure: false,
			},
		},
	},
	plugins: [
		tsConfigPaths(),
		tanstackStart({ customViteReactPlugin: true }),
		react(),
		tailwindcss(),
	],
});
