import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context }) => {
		if (context.user) {
			return;
		}

		redirect({ throw: true, to: "/login" });
	},
});
