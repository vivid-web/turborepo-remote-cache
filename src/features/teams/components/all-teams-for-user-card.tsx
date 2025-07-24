import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { getAllTeamsForUserQueryOptions } from "../queries/get-all-teams-for-user-query-options";
import { TeamsList } from "./teams-list";

type Props = React.ComponentProps<typeof Card> & {
	userId: string;
};

function AllTeamsForUserCard({ userId, ...props }: Props) {
	const query = useSuspenseQuery(getAllTeamsForUserQueryOptions({ userId }));

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Team Memberships</CardTitle>
				<CardDescription>Teams this user belongs to</CardDescription>
			</CardHeader>
			<CardContent>
				<TeamsList teams={query.data} />
			</CardContent>
		</Card>
	);
}

export { AllTeamsForUserCard };
