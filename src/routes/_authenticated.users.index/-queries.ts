import { queryOptions } from "@tanstack/react-query";

import { getTotalUsers } from "./-server-fns";

function totalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: ["total-users"],
	});
}

export { totalUsersQueryOptions };
