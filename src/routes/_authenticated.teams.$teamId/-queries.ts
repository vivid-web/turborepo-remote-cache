import { queryOptions } from "@tanstack/react-query";

import { getSingleTeam, getTotalMembers } from "./-server-fns";

type SingleTeamParams = {
	teamId: string;
};

function singleTeamQueryOptions(params: SingleTeamParams) {
	return queryOptions({
		queryFn: async () => getSingleTeam({ data: params }),
		queryKey: ["single-team", params.teamId],
	});
}

type TotalMembersParams = {
	teamId: string;
};

function totalMembersQueryOptions(params: TotalMembersParams) {
	return queryOptions({
		queryFn: async () => getTotalMembers({ data: params }),
		queryKey: ["total-members", params.teamId],
	});
}

export { singleTeamQueryOptions, totalMembersQueryOptions };
