import { createAuthClient } from "better-auth/react";

export const { signIn, useSession, signOut } = createAuthClient({
	baseURL: "http://localhost:3000",
});
