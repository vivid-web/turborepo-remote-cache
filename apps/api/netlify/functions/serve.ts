import type { Config, Context } from "@netlify/functions";

import { app } from "../../dist/index.js";

export default async (req: Request, context: Context) => {
	return app.fetch(req, { context });
};

export const config: Config = {
	path: "/*",
};
