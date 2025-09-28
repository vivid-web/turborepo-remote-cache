import { includeIgnoreFile } from "@eslint/compat";
import baseConfig from "@remote-cache/eslint-config/base";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, ".gitignore"),
	...baseConfig,
]);
