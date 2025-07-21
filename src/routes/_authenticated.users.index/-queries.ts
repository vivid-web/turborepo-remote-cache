import { queryOptions } from "@tanstack/react-query";

import { getAllUsers, getTotalUsers } from "./-server-fns";

type AllUsersParams = {
	query?: string;
};

function allUsersQueryOptions({ query }: AllUsersParams) {
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
