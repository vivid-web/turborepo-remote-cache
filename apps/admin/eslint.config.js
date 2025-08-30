import baseConfig from "@turborepo-remote-cache/eslint-config/base";
import reactConfig from "@turborepo-remote-cache/eslint-config/react";

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		ignores: [
			".cache",
			".nitro",
			".output",
			".tanstack",
			".turbo",
			".vite",
			"node_modules",
			"src/routeTree.gen.ts",
		],
	},
	...baseConfig,
	...reactConfig,
];
