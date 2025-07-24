import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getTotalTeamsForUser } from "../server-fns/get-total-teams-for-user";

type Params = {
	userId: string;
};

function getTotalTeamsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getTotalTeamsForUser({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "total-teams-for-user", params.userId],
	});
}

export { getTotalTeamsForUserQueryOptions };
