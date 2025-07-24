import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "../constants";
import { getTotalUsersForTeam } from "../server-fns/get-total-users-for-team";

type Params = {
	teamId: string;
};

function getTotalUsersForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getTotalUsersForTeam({ data: params }),
		queryKey: [USERS_QUERY_KEY, "total-users-for-team", params.teamId],
	});
}

export { getTotalUsersForTeamQueryOptions };
