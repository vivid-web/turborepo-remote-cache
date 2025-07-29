import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getDefaultValuesForUser } from "../server-fns/get-default-values-for-user";

type Params = {
	userId: string;
};

function getDefaultValuesForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getDefaultValuesForUser({ data: params }),
		queryKey: [USERS_QUERY_KEY, "default-values-for-user", params.userId],
	});
}

export { getDefaultValuesForUserQueryOptions };
