import { queryOptions } from "@tanstack/react-query";

import { SearchInput } from "./-schemas";
import { getAllUsers, getTotalUsers } from "./-server-fns";

function allUsersQueryOptions({ query }: SearchInput) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: { query } }),
		queryKey: ["all-users", query],
	});
}

function totalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: ["total-users"],
	});
}

export { allUsersQueryOptions, totalUsersQueryOptions };
