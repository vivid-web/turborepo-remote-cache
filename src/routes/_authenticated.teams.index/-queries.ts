import { queryOptions } from "@tanstack/react-query";

import { getTotalTeams } from "./-server-fns";

function totalTeamsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalTeams(),
		queryKey: ["total-teams"],
	});
}

export { totalTeamsQueryOptions };
