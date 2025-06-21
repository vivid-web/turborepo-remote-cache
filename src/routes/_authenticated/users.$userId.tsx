import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { z } from "zod/v4";

import { authMiddleware } from "@/middlewares/auth-middleware";

const UserIdSchema = z.string().min(1);

const fetchUser = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((userId: unknown) => UserIdSchema.parse(userId))
	.handler(async ({ data: userId }) => {
		const user = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, userId),
			columns: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		});

		if (!user) {
			throw notFound();
		}

		return user;
	});

function userQueryOptions(userId: string) {
	return queryOptions({
		queryFn: async () => fetchUser({ data: userId }),
		queryKey: ["users", userId],
	});
}

export const Route = createFileRoute("/_authenticated/users/$userId")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			userId: UserIdSchema.parse(params.userId),
		}),
	},
	loader: async ({ context, params: { userId } }) => {
		const user = await context.queryClient.ensureQueryData(
			userQueryOptions(userId),
		);

		return {
			crumb: user.email,
		};
	},
});

function RouteComponent() {
	const { userId } = Route.useParams();

	const userQuery = useSuspenseQuery(userQueryOptions(userId));

	return <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>;
}
