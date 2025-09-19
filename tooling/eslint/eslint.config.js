import { includeIgnoreFile } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "node:url";

import baseConfig from "./base.js";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
	...baseConfig,
]);
