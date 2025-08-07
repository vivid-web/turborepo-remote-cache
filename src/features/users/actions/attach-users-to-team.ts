import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const InputSchema = z.object({
	teamId: IdSchema,
	userIds: IdSchema.array(),
});

const attachUsersToTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { teamId, userIds } }) => {
		const values = userIds.map((userId) => ({ userId, teamId }));

		await db.insert(teamMember).values(values);
	});

function useAttachUsersToTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => attachUsersToTeam({ data }),
		onMutate: () => {
			const toastId = toast.loading("Attaching users to team...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Users attached to team successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to attach users to team", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { attachUsersToTeam, useAttachUsersToTeamMutation };
