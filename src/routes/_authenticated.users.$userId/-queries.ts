import { queryOptions } from "@tanstack/react-query";

import {
	getSingleUser,
	getTeamMemberships,
	getTotalTeams,
} from "./-server-fns";

type SingleUserParams = {
	userId: string;
};

function singleUserQueryOptions(params: SingleUserParams) {
	return queryOptions({
		queryFn: async () => getSingleUser({ data: params }),
		queryKey: ["single-user", params.userId],
	});
}

type TeamMembershipParams = {
	userId: string;
};

function teamMembershipsQueryOptions(params: TeamMembershipParams) {
	return queryOptions({
		queryFn: async () => getTeamMemberships({ data: params }),
		queryKey: ["users", "team-membership", params.userId],
	});
}

type TotalTeamsParams = {
	userId: string;
};

function totalTeamsQueryOptions(params: TotalTeamsParams) {
	return queryOptions({
		queryFn: async () => getTotalTeams({ data: params }),
		queryKey: ["users", "total-teams", params.userId],
	});
}

export {
	singleUserQueryOptions,
	teamMembershipsQueryOptions,
	totalTeamsQueryOptions,
};
