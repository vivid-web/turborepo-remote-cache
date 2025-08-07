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
	userId: IdSchema,
	teamId: IdSchema,
});

const detachUserFromTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { teamId, userId } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(teamMember.teamId, teamId));
		filters.push(eq(teamMember.userId, userId));

		await db.delete(teamMember).where(and(...filters));
	});

function useDetachUserFromTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => detachUserFromTeam({ data }),
		onMutate: () => {
			const toastId = toast.loading("Detaching user from team...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("User detached from team successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to detach user from team", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { detachUserFromTeam, useDetachUserFromTeamMutation };
