import { createFileRoute } from "@tanstack/react-router";
import { UserPenIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { UserGeneralInfoCard } from "@/features/users/components/user-general-info-card";
import { getDefaultValuesForUserQueryOptions } from "@/features/users/queries/get-default-values-for-user-query-options";
import { getUserGeneralInfoQueryOptions } from "@/features/users/queries/get-user-general-info-query-options";
import { getBreadcrumbForUser } from "@/features/users/server-fns/get-breadcrumb-for-user";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ userId: IdSchema }).parse(params),
	},
	loader: async ({ context: { queryClient }, params }) => {
		const crumb = await getBreadcrumbForUser({ data: params });

		await Promise.all([
			queryClient.ensureQueryData(getUserGeneralInfoQueryOptions(params)),
			queryClient.ensureQueryData(getDefaultValuesForUserQueryOptions(params)),
		]);

		return { crumb };
	},
});

function RouteComponent() {
	const params = Route.useParams();

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
				<EditUserDialog userId={params.userId}>
					<Button className="gap-2">
						<UserPenIcon className="h-4 w-4" />
						Edit User
					</Button>
				</EditUserDialog>
			</div>

			<UserGeneralInfoCard userId={params.userId} />
		</div>
	);
}
