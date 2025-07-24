import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getTotalTeams } from "../server-fns/get-total-teams";

function getTotalTeamsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalTeams(),
		queryKey: [TEAMS_QUERY_KEY, "total-teams"],
	});
}

export { getTotalTeamsQueryOptions };
