import baseConfig from "@turborepo-remote-cache/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		ignores: [".cache", ".turbo", "dist", "node_modules"],
	},
	...baseConfig,
];
