import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/api-keys")({
	loader: () => ({
		crumb: "API keys",
	}),
});
