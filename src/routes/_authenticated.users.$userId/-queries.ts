import { queryOptions } from "@tanstack/react-query";

import { getSingleUser } from "@/features/users/server-fns/get-single-user";

type SingleUserParams = {
	userId: string;
};

function singleUserQueryOptions(params: SingleUserParams) {
	return queryOptions({
		queryFn: async () => getSingleUser({ data: params }),
		queryKey: ["single-user", params.userId],
	});
}

export { singleUserQueryOptions };
