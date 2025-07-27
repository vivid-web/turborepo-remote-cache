import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getSingleUser } from "../server-fns/get-single-user";

type Params = {
	userId: string;
};

function singleUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getSingleUser({ data: params }),
		queryKey: [USERS_QUERY_KEY, "single-user", params.userId],
	});
}

export { singleUserQueryOptions };
