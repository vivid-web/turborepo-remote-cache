import { queryOptions } from "@tanstack/react-query";

import { getTotalUsers } from "../server-fns/get-total-users";

function totalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: ["total-users"],
	});
}

export { totalUsersQueryOptions };
