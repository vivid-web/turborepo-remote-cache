import { queryOptions } from "@tanstack/react-query";

import { getSingleTeam } from "./-server-fns";

type SingleTeamParams = {
	teamId: string;
};

function singleTeamQueryOptions(params: SingleTeamParams) {
	return queryOptions({
		queryFn: async () => getSingleTeam({ data: params }),
		queryKey: ["single-team", params.teamId],
	});
}

export { singleTeamQueryOptions };
