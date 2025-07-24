import { useSuspenseQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTotalUsersForTeamQueryOptions } from "../queries/get-total-users-for-team-query-options";

type Props = {
	teamId: string;
};

function TotalUsersForTeamCard({ teamId }: Props) {
	const query = useSuspenseQuery(getTotalUsersForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Members</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Members in the system</p>
			</CardContent>
		</Card>
	);
}

export { TotalUsersForTeamCard };
