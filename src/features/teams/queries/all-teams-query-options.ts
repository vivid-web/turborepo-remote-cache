import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getAllTeams } from "../server-fns/get-all-teams";

type Params = {
	query?: string;
};

function allTeamsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeams({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "all-teams", params.query],
	});
}

export { allTeamsQueryOptions };
