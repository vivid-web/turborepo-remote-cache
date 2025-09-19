import { includeIgnoreFile } from "@eslint/compat";
import baseConfig from "@turborepo-remote-cache/eslint-config/base";
import reactConfig from "@turborepo-remote-cache/eslint-config/react";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, ".gitignore"),
	...baseConfig,
	...reactConfig,
	{ ignores: ["./src/routeTree.gen.ts"] },
]);
