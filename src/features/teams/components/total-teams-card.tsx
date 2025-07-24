import { useSuspenseQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTotalTeamsQueryOptions } from "../queries/get-total-teams-query-options";

function TotalTeamsCard() {
	const query = useSuspenseQuery(getTotalTeamsQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Teams</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Teams in the system</p>
			</CardContent>
		</Card>
	);
}

export { TotalTeamsCard };
