import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getUserGeneralInfo } from "../server-fns/get-user-general-info";

type Params = {
	userId: string;
};

function getUserGeneralInfoQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getUserGeneralInfo({ data: params }),
		queryKey: [USERS_QUERY_KEY, "user-general-info", params.userId],
	});
}

export { getUserGeneralInfoQueryOptions };
