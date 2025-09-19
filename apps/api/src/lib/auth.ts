import { createAuth } from "@turborepo-remote-cache/auth";

import { env } from "../env.js";

export const auth = createAuth({
	trustedOrigins: [env.ADMIN_URL],
	baseURL: env.BASE_URL,
});
