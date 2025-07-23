import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getBreadcrumbForTeam } from "@/features/teams/server-fns/get-breadcrumb-for-team";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ teamId: IdSchema }).parse(params),
	},
	loader: async ({ params }) => {
		const crumb = await getBreadcrumbForTeam({ data: params });

		return { crumb };
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Team Details</h1>
						<p className="text-muted-foreground">Manage team information</p>
					</div>
				</div>
			</div>
		</div>
	);
}
