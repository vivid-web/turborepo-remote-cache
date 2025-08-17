import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
	component: PathlessLayoutComponent,
	beforeLoad: ({ context }) => {
		if (!context.user) {
			return;
		}

		redirect({ throw: true, to: "/" });
	},
});

function PathlessLayoutComponent() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-3xl">
				<div className="flex flex-col gap-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
