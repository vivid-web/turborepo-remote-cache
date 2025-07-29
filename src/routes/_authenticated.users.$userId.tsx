import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPenIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { UserInfoCard } from "@/features/users/components/user-info-card";
import { getSingleUserQueryOptions } from "@/features/users/queries/get-single-user-query-options";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ userId: IdSchema }).parse(params),
	},
	loader: async ({ context: { queryClient }, params }) => {
		const user = await queryClient.ensureQueryData(
			getSingleUserQueryOptions(params),
		);

		return { crumb: user.name };
	},
});

function RouteComponent() {
	const params = Route.useParams();
	const { data: user } = useSuspenseQuery(getSingleUserQueryOptions(params));

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
