import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, signOut } = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [adminClient()],
});
