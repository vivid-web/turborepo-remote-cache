import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { totalMembersQueryOptions } from "../-queries";

const route = getRouteApi("/_authenticated/teams/$teamId");

function TotalMembersCard(props: React.ComponentProps<typeof Card>) {
	const params = route.useParams();

	const query = useSuspenseQuery(totalMembersQueryOptions(params));

	return (
		<Card {...props}>
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

export { TotalMembersCard };
