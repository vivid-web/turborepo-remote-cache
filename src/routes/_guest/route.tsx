import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
	beforeLoad: ({ context }) => {
		if (!context.user) {
			return;
		}

		redirect({ throw: true, to: "/" });
	},
});
