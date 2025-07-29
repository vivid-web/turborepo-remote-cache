import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { asc, ilike, or, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";
import { QuerySchema } from "../schemas";
import { SearchUsersForm } from "./search-users-form";
import { UsersTable } from "./users-table";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	query: QuerySchema.optional(),
});

const getAllUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { query } }) => {
		const filters: Array<SQL> = [];

		if (query) {
			filters.push(ilike(user.email, `%${query}%`));
			filters.push(ilike(user.name, `%${query}%`));
		}

		return db
			.select({
				userId: user.id,
				name: user.name,
				image: user.image,
				email: user.email,
			})
			.from(user)
			.where(or(...filters))
			.orderBy(asc(user.name));
	});

function getAllUsersQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: params }),
		queryKey: [USERS_QUERY_KEY, "all-users", params.query],
	});
}

function AllUsersCard({
	query,
	onSearch,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: users } = useSuspenseQuery(getAllUsersQueryOptions({ query }));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">All Users</CardTitle>
						<CardDescription>
							A list of all users in the system and their cache usage
						</CardDescription>
					</div>

					<SearchUsersForm onSearch={onSearch} query={query} />
				</div>
			</CardHeader>
			<CardContent>
				<UsersTable users={users} />
			</CardContent>
		</Card>
	);
}

AllUsersCard.queryOptions = getAllUsersQueryOptions;

export { AllUsersCard };
