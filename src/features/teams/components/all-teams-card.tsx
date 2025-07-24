import { useSuspenseQuery } from "@tanstack/react-query";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { getAllTeamsQueryOptions } from "../queries/get-all-teams-query-options";
import { SearchTeamsForm } from "./search-teams-form";
import { TeamsTable } from "./teams-table";

type Props = {
	onSearch: (query?: string) => Promise<void> | void;
	query?: string;
};

function AllTeamsCard({ query, onSearch }: Props) {
	const { data: teams } = useSuspenseQuery(getAllTeamsQueryOptions({ query }));

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

					<SearchTeamsForm query={query} onSearch={onSearch} />
				</div>
			</CardHeader>
			<CardContent>
				<TeamsTable teams={teams} />
			</CardContent>
		</Card>
	);
}

export { AllTeamsCard };
