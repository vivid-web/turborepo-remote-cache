import { fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		settings: {
			react: {
				version: "detect",
			},
		},
		plugins: {
			"react-hooks": fixupPluginRules(reactHooks),
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react/function-component-definition": [
				"error",
				{ namedComponents: "function-declaration" },
			],
		},
	},
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		...react.configs.flat.recommended,
		...react.configs.flat["jsx-runtime"],
	},
]);
