import { queryOptions } from "@tanstack/react-query";

import { getTotalTeams } from "../server-fns/get-total-teams";

function totalTeamsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalTeams(),
		queryKey: ["total-teams"],
	});
}

export { totalTeamsQueryOptions };
