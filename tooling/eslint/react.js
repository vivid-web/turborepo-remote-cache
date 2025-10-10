import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

/** @type {import("@eslint/core").ConfigObject} */
export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		...react.configs.flat.recommended,
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		...react.configs.flat["jsx-runtime"],
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		...reactHooks.configs.flat["recommended-latest"],
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
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
]);
