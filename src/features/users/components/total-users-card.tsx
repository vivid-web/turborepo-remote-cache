import { useSuspenseQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTotalUsersQueryOptions } from "../queries/get-total-users-query-options";

function TotalUsersCard() {
	const query = useSuspenseQuery(getTotalUsersQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Users</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">
					Registered in the system
				</p>
			</CardContent>
		</Card>
	);
}

export { TotalUsersCard };
