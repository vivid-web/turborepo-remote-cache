import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { teamMembershipsQueryOptions } from "../-queries";
import { TeamMembershipsList } from "./team-memberships-list";

const route = getRouteApi("/_authenticated/users/$userId");

function TeamMembershipsCard() {
	const params = route.useParams();

	const query = useSuspenseQuery(teamMembershipsQueryOptions(params));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Memberships</CardTitle>
				<CardDescription>Teams this user belongs to</CardDescription>
			</CardHeader>
			<CardContent>
				<TeamMembershipsList teams={query.data} />
			</CardContent>
		</Card>
	);
}

export { TeamMembershipsCard };
