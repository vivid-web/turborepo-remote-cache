import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getSingleTeam } from "../server-fns/get-single-team";

type Params = {
	teamId: string;
};

function getSingleTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getSingleTeam({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "single-team", params.teamId],
	});
}

export { getSingleTeamQueryOptions };
