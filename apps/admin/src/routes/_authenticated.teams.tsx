import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams")({
	loader: () => ({
		crumb: "Teams",
	}),
});
