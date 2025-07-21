import { queryOptions } from "@tanstack/react-query";

import { getAllTeams, getTotalTeams } from "./-server-fns";

type AllTeamsParams = {
	query?: string;
};

function allTeamsQueryOptions(params: AllTeamsParams) {
	return queryOptions({
		queryFn: async () => getAllTeams({ data: params }),
		queryKey: ["all-teams", params.query],
	});
}

function totalTeamsQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalTeams(),
		queryKey: ["total-teams"],
	});
}

export { allTeamsQueryOptions, totalTeamsQueryOptions };
