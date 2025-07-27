import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { allTeamsQueryOptions } from "../-queries";
import { SearchTeamsForm } from "./search-teams-form";
import { TeamsTable } from "./teams-table";

const route = getRouteApi("/_authenticated/teams/");

function AllTeamsCard() {
	const search = route.useSearch();

	const query = useSuspenseQuery(allTeamsQueryOptions(search));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Teams</CardTitle>
						<CardDescription>
							A list of all teams and their members
						</CardDescription>
					</div>

					<SearchTeamsForm />
				</div>
			</CardHeader>
			<CardContent>
				<TeamsTable teams={query.data} />
			</CardContent>
		</Card>
	);
}

export { AllTeamsCard };
