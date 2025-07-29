import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember, user } from "drizzle/schema";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";
import { UsersList } from "./users-list";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({ teamId: IdSchema });

const getAllUsersForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		return db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
			})
			.from(user)
			.innerJoin(teamMember, eq(teamMember.userId, user.id))
			.where(eq(teamMember.teamId, teamId));
	});

function allUsersForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAllUsersForTeam({ data: params }),
		queryKey: [USERS_QUERY_KEY, "all-users-for-team", params.teamId],
	});
}

function AllUsersForTeamCard({ teamId }: Params) {
	const query = useSuspenseQuery(allUsersForTeamQueryOptions({ teamId }));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">Team Members</CardTitle>
						<CardDescription>
							A list of members that are attached to this team
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<UsersList users={query.data} />
			</CardContent>
		</Card>
	);
}

AllUsersForTeamCard.queryOptions = allUsersForTeamQueryOptions;

export { AllUsersForTeamCard };
