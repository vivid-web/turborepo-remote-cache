import { useSuspenseQuery } from "@tanstack/react-query";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { getAllUsersForTeamQueryOptions } from "../queries/get-all-users-for-team-query-options";
import { UsersList } from "./users-list";

type Props = {
	teamId: string;
};

function AllUsersForTeamCard({ teamId }: Props) {
	const query = useSuspenseQuery(getAllUsersForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">Team Members</CardTitle>
						<CardDescription>
							A list of members that are attached to this team
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<UsersList users={query.data} />
			</CardContent>
		</Card>
	);
}

export { AllUsersForTeamCard };
