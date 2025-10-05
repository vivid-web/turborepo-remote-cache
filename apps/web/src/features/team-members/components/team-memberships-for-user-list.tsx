import { ItemGroup } from "@/components/ui/item";

import { NoTeamMembershipsPlaceholder } from "./no-team-memberships-placeholder";
import { TeamMembershipItem } from "./team-membership-item";

type Params = {
	userId: string;
};

type Team = {
	name: string;
	teamId: string;
};

function TeamMembershipsForUserList({
	teams,
	userId,
}: Params & { teams: Array<Team> }) {
	if (teams.length === 0) {
		return <NoTeamMembershipsPlaceholder userId={userId} />;
	}

	return (
		<ItemGroup className="gap-4">
			{teams.map((team) => (
				<TeamMembershipItem {...team} key={team.teamId} userId={userId} />
			))}
		</ItemGroup>
	);
}

export { TeamMembershipsForUserList };
