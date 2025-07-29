import { queryOptions } from "@tanstack/react-query";

import { TEAMS_QUERY_KEY } from "../constants";
import { getDefaultValuesForTeam } from "../server-fns/get-default-values-for-team";

type Params = {
	teamId: string;
};

function getDefaultValuesForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getDefaultValuesForTeam({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "default-values-for-team", params.teamId],
	});
}

export { getDefaultValuesForTeamQueryOptions };
