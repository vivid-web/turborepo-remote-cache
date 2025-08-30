import baseConfig from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		ignores: [".cache", ".turbo", "node_modules"],
	},
	...baseConfig,
];
