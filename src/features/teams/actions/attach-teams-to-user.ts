import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { teamMember } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const InputSchema = z.object({
	userId: IdSchema,
	teamIds: IdSchema.array(),
});

const attachTeamsToUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { userId, teamIds } }) => {
		const values = teamIds.map((teamId) => ({ userId, teamId }));

		await db.insert(teamMember).values(values);
	});

function useAttachTeamsToUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => attachTeamsToUser({ data }),
		onMutate: () => {
			const toastId = toast.loading("Attaching teams to user...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Teams attached to user successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to attach teams to user", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { attachTeamsToUser, useAttachTeamsToUserMutation };
