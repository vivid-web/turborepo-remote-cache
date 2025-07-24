import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { totalTeamsQueryOptions } from "../-queries";

const route = getRouteApi("/_authenticated/users/$userId");

function TotalTeamsCard(props: React.ComponentProps<typeof Card>) {
	const params = route.useParams();

	const query = useSuspenseQuery(totalTeamsQueryOptions(params));

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

export { TotalTeamsCard };
