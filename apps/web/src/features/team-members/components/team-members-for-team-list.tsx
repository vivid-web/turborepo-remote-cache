import { ItemGroup } from "@/components/ui/item";

import { NoTeamMembersPlaceholder } from "./no-team-members-placeholder";
import { TeamMemberItem } from "./team-member-item";

type Params = {
	teamId: string;
};

type User = {
	email: string;
	image: null | string;
	name: string;
	userId: string;
};

function TeamMembersForTeamList({
	users,
	teamId,
}: Params & { users: Array<User> }) {
	if (!users.length) {
		return <NoTeamMembersPlaceholder teamId={teamId} />;
	}

	return (
		<ItemGroup className="gap-4">
			{users.map((user) => (
				<TeamMemberItem {...user} teamId={teamId} key={user.userId} />
			))}
		</ItemGroup>
	);
}

export { TeamMembersForTeamList };
