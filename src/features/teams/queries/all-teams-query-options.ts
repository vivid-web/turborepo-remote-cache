import { queryOptions } from "@tanstack/react-query";

import { getAllTeams } from "../server-fns/get-all-teams";

type Params = {
	query?: string;
};

function allTeamsQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllTeams({ data: params }),
		queryKey: ["all-teams", params.query],
	});
}

export { allTeamsQueryOptions };
