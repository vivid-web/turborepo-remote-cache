import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { totalUsersQueryOptions } from "../-queries";

function TotalUsersCard(props: React.ComponentProps<typeof Card>) {
	const query = useSuspenseQuery(totalUsersQueryOptions());

	return (
		<Card {...props}>
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
