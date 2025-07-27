import { useSuspenseQuery } from "@tanstack/react-query";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { allUsersQueryOptions } from "@/features/users/queries/all-users-query-options";

import { SearchUsersForm } from "./search-users-form";
import { UsersTable } from "./users-table";

type Props = {
	onSearch: (query?: string) => Promise<void> | void;
	query?: string | undefined;
};

function AllUsersCard({ onSearch, query }: Props) {
	const { data: users } = useSuspenseQuery(allUsersQueryOptions({ query }));

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

					<SearchUsersForm onSearch={onSearch} query={query} />
				</div>
			</CardHeader>
			<CardContent>
				<UsersTable users={users} />
			</CardContent>
		</Card>
	);
}

export { AllUsersCard };
