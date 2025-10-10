import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

/** @type {import("@eslint/core").ConfigObject} */
export default defineConfig([
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"react/function-component-definition": [
				"error",
				{ namedComponents: "function-declaration" },
			],
		},
	},
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		...reactHooks.configs.flat["recommended-latest"],
	},
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		...react.configs.flat.recommended,
		...react.configs.flat["jsx-runtime"],
	},
]);
