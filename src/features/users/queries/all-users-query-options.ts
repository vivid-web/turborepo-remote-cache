import { queryOptions } from "@tanstack/react-query";

import { getAllUsers } from "../server-fns/get-all-users";

type Params = {
	query?: string;
};

function allUsersQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: params }),
		queryKey: ["all-users", params.query],
	});
}

export { allUsersQueryOptions };
