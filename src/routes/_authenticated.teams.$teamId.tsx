import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllArtifactsForTeamCard } from "@/features/artifacts/components/all-artifacts-for-team-card";
import { TotalArtifactsForTeamCard } from "@/features/artifacts/components/total-artifacts-for-team-card";
import { AllTeamMembersForTeamCard } from "@/features/team-members/components/all-team-members-for-team-card";
import { TeamDangerZoneCard } from "@/features/teams/components/team-danger-zone-card";
import { TeamSettingsCard } from "@/features/teams/components/team-settings-card";
import { getBreadcrumbForTeam } from "@/features/teams/queries/get-breadcrumb-for-team";
import { TotalUsersForTeamCard } from "@/features/users/components/total-users-for-team-card";
import { IdSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
	component: RouteComponent,
	params: {
		parse: (params) => z.object({ teamId: IdSchema }).parse(params),
	},
	loader: async ({ context: { queryClient }, params }) => {
		const crumb = await getBreadcrumbForTeam({ data: params });

		// prettier-ignore
		await Promise.all([
			queryClient.ensureQueryData(TotalUsersForTeamCard.queryOptions(params)),
			queryClient.ensureQueryData(TotalArtifactsForTeamCard.queryOptions(params)),
			queryClient.ensureQueryData(AllTeamMembersForTeamCard.queryOptions(params)),
			queryClient.ensureQueryData(AllArtifactsForTeamCard.queryOptions(params)),
			queryClient.ensureQueryData(TeamSettingsCard.queryOptions(params)),
			queryClient.ensureQueryData(AllTeamMembersForTeamCard.queryOptions(params)),
		]);

		return { crumb };
	},
});

function RouteComponent() {
	const { teamId } = Route.useParams();

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

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersForTeamCard teamId={teamId} />

				<TotalArtifactsForTeamCard teamId={teamId} />
			</div>

			<Tabs defaultValue="member" className="space-y-4">
				<TabsList>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="artifacts">Artifacts</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="members">
					<AllTeamMembersForTeamCard teamId={teamId} />
				</TabsContent>

				<TabsContent value="artifacts">
					<AllArtifactsForTeamCard teamId={teamId} />
				</TabsContent>

				<TabsContent value="settings" className="grid gap-6">
					<TeamSettingsCard teamId={teamId} />
					<TeamDangerZoneCard teamId={teamId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
