import { queryOptions } from "@tanstack/react-query";

import { ParamsInput } from "./-schemas";
import { getSingleUser } from "./-server-fns";

function singleUserQueryOptions(params: ParamsInput) {
	return queryOptions({
		queryFn: async () => getSingleUser({ data: params }),
		queryKey: ["single-user", params.userId],
	});
}

export { singleUserQueryOptions };
