import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { session, user } from "drizzle/schema";
import { ActivityIcon, CalendarIcon, MailIcon } from "lucide-react";
import * as R from "remeda";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";
import {
	formatCreatedDate,
	formatLastLoginDate,
	getAvatarFallback,
} from "../utils";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getUserGeneralInfo = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const foundUser = await db
			.select({
				email: user.email,
				name: user.name,
				image: user.image,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1)
			.then(R.first());

		if (!foundUser) {
			throw notFound();
		}

		const foundSession = await db
			.select({ lastLoggedInAt: session.createdAt })
			.from(session)
			.where(eq(session.userId, userId))
			.orderBy(desc(session.createdAt))
			.limit(1)
			.then(R.first());

		const lastLoggedInAt = foundSession?.lastLoggedInAt ?? null;

		return {
			...foundUser,
			lastLoggedInAt,
		};
	});

function userGeneralInfoQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getUserGeneralInfo({ data: params }),
		queryKey: [USERS_QUERY_KEY, "user-general-info", params.userId],
	});
}

function UserGeneralInfoCard({ userId }: Params) {
	const { data } = useSuspenseQuery(userGeneralInfoQueryOptions({ userId }));

	return (
		<Card>
			<CardContent>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16">
							{data.image && <AvatarImage src={data.image} alt={data.name} />}
							<AvatarFallback className="text-lg">
								{getAvatarFallback(data.name)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div>
								<h2 className="text-foreground text-xl font-semibold">
									{data.name}
								</h2>
								<div className="text-muted-foreground flex items-center gap-2">
									<MailIcon className="h-4 w-4" />
									<span>{data.email}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="text-muted-foreground space-y-1 text-right text-sm">
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							<span>Joined {formatCreatedDate(data.createdAt)}</span>
						</div>
						<div className="flex items-center gap-2">
							<ActivityIcon className="h-4 w-4" />
							<span>Last login {formatLastLoginDate(data.lastLoggedInAt)}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

UserGeneralInfoCard.queryOptions = userGeneralInfoQueryOptions;

export { UserGeneralInfoCard };
