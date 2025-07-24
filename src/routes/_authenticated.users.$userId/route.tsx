import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTeamsForUserCard } from "@/features/teams/components/all-teams-for-user-card";
import { TotalTeamsForUserCard } from "@/features/teams/components/total-teams-for-user-card";
import { getAllTeamsForUserQueryOptions } from "@/features/teams/queries/get-all-teams-for-user-query-options";
import { getTotalTeamsForUserQueryOptions } from "@/features/teams/queries/get-total-teams-for-user-query-options";
import { UserDangerZoneCard } from "@/features/users/components/user-danger-zone-card";
import { UserInfoCard } from "@/features/users/components/user-info-card";
import { UserSettingsCard } from "@/features/users/components/user-settings-card";
import { getSingleUserQueryOptions } from "@/features/users/queries/get-single-user-query-options";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ userId: IdSchema }).parse(params),
	},
	loader: async ({ context, params }) => {
		const [user] = await Promise.all([
			context.queryClient.ensureQueryData(getSingleUserQueryOptions(params)),
			context.queryClient.ensureQueryData(
				getTotalTeamsForUserQueryOptions(params),
			),
			context.queryClient.ensureQueryData(
				getAllTeamsForUserQueryOptions(params),
			),
		]);

		return { crumb: user.name };
	},
});

function RouteComponent() {
	const { userId } = Route.useParams();

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
			</div>

			<UserInfoCard userId={userId} />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<TotalTeamsForUserCard userId={userId} />
			</div>

			<Tabs defaultValue="teams" className="space-y-4">
				<TabsList>
					<TabsTrigger value="teams">Team Memberships</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="teams">
					<AllTeamsForUserCard userId={userId} />
				</TabsContent>

				<TabsContent value="settings" className="grid gap-6">
					<UserSettingsCard userId={userId} />
					<UserDangerZoneCard userId={userId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
