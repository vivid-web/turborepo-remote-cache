import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const InputSchema = z.object({
	teamId: IdSchema,
	userId: IdSchema,
});

const detachTeamFromUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

function useDetachTeamFromUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => detachTeamFromUser({ data }),
		onMutate: () => {
			const toastId = toast.loading("Detaching team from user...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Team detached from user successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to detach team from user", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { detachTeamFromUser, useDetachTeamFromUserMutation };
