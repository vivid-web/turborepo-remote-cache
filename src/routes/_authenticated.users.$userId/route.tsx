import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPenIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { IdSchema } from "@/lib/schemas";

import { EditUserDialog } from "./-components/edit-user-dialog";
import { UserInfoCard } from "./-components/user-info-card";
import { singleUserQueryOptions } from "./-queries";

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ userId: IdSchema }).parse(params),
	},
	loader: async ({ context, params }) => {
		const user = await context.queryClient.ensureQueryData(
			singleUserQueryOptions(params),
		);

		return { crumb: user.name };
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const { data: user } = useSuspenseQuery(singleUserQueryOptions(params));

	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">User Details</h1>
						<p className="text-muted-foreground">
							Manage user information and permissions
						</p>
					</div>
				</div>
				<EditUserDialog {...user}>
					<Button className="gap-2">
						<UserPenIcon className="h-4 w-4" />
						Edit User
					</Button>
				</EditUserDialog>
			</div>

			<UserInfoCard {...user} />
		</div>
	);
}
