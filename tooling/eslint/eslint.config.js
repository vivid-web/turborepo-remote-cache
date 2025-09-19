import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

import baseConfig from "./base.js";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default [includeIgnoreFile(gitignorePath, ".gitignore"), ...baseConfig];
