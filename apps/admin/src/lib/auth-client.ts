import { createAuth } from "@turborepo-remote-cache/auth/client";

export const { signIn, signUp, useSession, signOut } = createAuth({
	baseURL: "http://localhost:3000",
});
