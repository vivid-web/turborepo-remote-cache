import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import globals from "globals";
import * as ts from "typescript-eslint";

/** @type {import("@eslint/core").ConfigObject} */
export default defineConfig(
	prettierConfig,
	perfectionist.configs["recommended-natural"],
	comments.recommended,
	js.configs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	importX.flatConfigs.react,
	{
		linterOptions: { reportUnusedDisableDirectives: "error" },
		languageOptions: { parserOptions: { projectService: true } },
	},
	{
		files: ["**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}"],
		languageOptions: {
			parser: ts.parser,
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.serviceworker,
				...globals.browser,
				...globals.node,
				...globals.builtin,
				...globals.es2021,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"import-x/no-cycle": "error",
			"import-x/no-extraneous-dependencies": "error",
			"perfectionist/sort-jsx-props": "off",
			"perfectionist/sort-module": "off",
			"perfectionist/sort-modules": "off",
			"perfectionist/sort-objects": "off",
		},
	},
	{
		files: ["**/*.{ts,tsx,cts,mts}"],
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.json"],
			},
		},
		extends: [
			...ts.configs.strictTypeChecked,
			...ts.configs.stylisticTypeChecked,
		],
		rules: {
			"@typescript-eslint/array-type": ["error", { default: "generic" }],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/only-throw-error": "off",
			"@typescript-eslint/prefer-nullish-coalescing": [
				"error",
				{
					ignorePrimitives: {
						bigint: false,
						boolean: false,
						number: false,
						string: true,
					},
				},
			],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowAny: false,
					allowBoolean: false,
					allowNever: false,
					allowNullish: false,
					allowNumber: true,
					allowRegExp: false,
				},
			],
			"@typescript-eslint/switch-exhaustiveness-check": "error",
		},
	},
);
