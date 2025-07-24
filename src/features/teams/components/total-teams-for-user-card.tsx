import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTotalTeamsForUserQueryOptions } from "../queries/get-total-teams-for-user-query-options";

type Props = React.ComponentProps<typeof Card> & {
	userId: string;
};

function TotalTeamsForUserCard({ userId, ...props }: Props) {
	const query = useSuspenseQuery(getTotalTeamsForUserQueryOptions({ userId }));

	return (
		<Card {...props}>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Teams</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">Active memberships</p>
			</CardContent>
		</Card>
	);
}

export { TotalTeamsForUserCard };
