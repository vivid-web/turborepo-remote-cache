import { createFileRoute } from "@tanstack/react-router";
import { UserPenIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { AllTeamsForUserCard } from "@/features/teams/components/all-teams-for-user-card";
import { TotalTeamsForUserCard } from "@/features/teams/components/total-teams-for-user-card";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { UserGeneralInfoCard } from "@/features/users/components/user-general-info-card";
import { UserSettingsCard } from "@/features/users/components/user-settings-card";
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
			queryClient.ensureQueryData(UserGeneralInfoCard.queryOptions(params)),
			queryClient.ensureQueryData(EditUserDialog.queryOptions(params)),
			queryClient.ensureQueryData(TotalTeamsForUserCard.queryOptions(params)),
			queryClient.ensureQueryData(AllTeamsForUserCard.queryOptions(params)),
			queryClient.ensureQueryData(UserSettingsCard.queryOptions(params)),
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

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<TotalTeamsForUserCard userId={params.userId} />
			</div>

			<AllTeamsForUserCard userId={params.userId} />

			<UserSettingsCard userId={params.userId} />
		</div>
	);
}
