import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { allUsersQueryOptions } from "../-queries";
import { SearchUsersForm } from "./search-users-form";
import { UsersTable } from "./users-table";

const route = getRouteApi("/_authenticated/users/");

function AllUsersCard() {
	const search = route.useSearch();

	const query = useSuspenseQuery(allUsersQueryOptions(search));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Users</CardTitle>
						<CardDescription>
							A list of all users in the system and their cache usage
						</CardDescription>
					</div>

					<SearchUsersForm />
				</div>
			</CardHeader>
			<CardContent>
				<UsersTable users={query.data} />
			</CardContent>
		</Card>
	);
}

export { AllUsersCard };
