import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/users")({
	loader: () => ({
		crumb: "Users",
	}),
});
