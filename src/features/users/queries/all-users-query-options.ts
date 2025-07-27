import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getAllUsers } from "../server-fns/get-all-users";

type Params = {
	query?: string;
};

function allUsersQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: params }),
		queryKey: [USERS_QUERY_KEY, "all-users", params.query],
	});
}

export { allUsersQueryOptions };
