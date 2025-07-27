import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getTotalUsers } from "../server-fns/get-total-users";

function getTotalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: [USERS_QUERY_KEY, "total-users"],
	});
}

export { getTotalUsersQueryOptions };
