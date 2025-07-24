import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getAllTeamsForUser } from "../server-fns/get-all-teams-for-user";

type Params = {
	userId: string;
};

function getAllTeamsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeamsForUser({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "all-teams-for-user", params.userId],
	});
}

export { getAllTeamsForUserQueryOptions };
