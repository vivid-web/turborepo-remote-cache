import { asc, desc, eq, ilike, inArray, or, SQL } from "@remote-cache/db";
import { session, user } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as R from "remeda";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
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
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { query } }) => {
		const filters: Array<SQL> = [];

		if (query) {
			filters.push(ilike(user.email, `%${query}%`));
			filters.push(ilike(user.name, `%${query}%`));
		}

		const users = await db
			.select({
				userId: user.id,
				name: user.name,
				image: user.image,
				email: user.email,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(or(...filters))
			.orderBy(asc(user.name));

		const sessions = await db
			.selectDistinct({
				userId: session.userId,
				lastLoggedInAt: session.createdAt,
			})
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(inArray(user.id, users.map(R.prop("userId"))))
			.orderBy(desc(session.createdAt));

		return users.map((user) => {
			const session = sessions.find(
				(session) => session.userId === user.userId,
			);

			const lastLoggedInAt = session?.lastLoggedInAt ?? null;

			return { ...user, lastLoggedInAt };
		});
	});

function allUsersQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsers({ data: params }),
		queryKey: [USERS_QUERY_KEY, "all-users", params.query],
	});
}

function AllUsersCard({
	query,
	onSearch,
}: Params & { onSearch: (query?: string) => Promise<void> | void }) {
	const { data: users } = useSuspenseQuery(allUsersQueryOptions({ query }));

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

AllUsersCard.queryOptions = allUsersQueryOptions;

export { AllUsersCard };
