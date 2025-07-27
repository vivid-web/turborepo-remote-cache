import { queryOptions } from "@tanstack/react-query";

import { getAllUsers } from "@/features/users/server-fns/get-all-users";
import { getTotalUsers } from "@/features/users/server-fns/get-total-users";

type AllUsersParams = {
	query?: string;
};

function allUsersQueryOptions(params: AllUsersParams) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: params }),
		queryKey: ["all-users", params.query],
	});
}

function totalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: ["total-users"],
	});
}

export { allUsersQueryOptions, totalUsersQueryOptions };
