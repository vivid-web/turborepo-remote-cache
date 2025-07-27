import { queryOptions } from "@tanstack/react-query";

import { getSingleUser } from "../server-fns/get-single-user";

type Params = {
	userId: string;
};

function singleUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getSingleUser({ data: params }),
		queryKey: ["single-user", params.userId],
	});
}

export { singleUserQueryOptions };
