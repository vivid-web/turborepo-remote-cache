import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getAllUsersForTeam } from "../server-fns/get-all-users-for-team";

type Params = {
	teamId: string;
};

function getAllUsersForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsersForTeam({ data: params }),
		queryKey: [USERS_QUERY_KEY, "all-users-for-team", params.teamId],
	});
}

export { getAllUsersForTeamQueryOptions };
