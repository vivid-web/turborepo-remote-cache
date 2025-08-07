import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const InputSchema = z.object({
	teamId: IdSchema,
	name: NameSchema,
	slug: SlugSchema,
	description: DescriptionSchema.optional(),
});

const updateTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { teamId, ...data } }) => {
		await db.update(team).set(data).where(eq(team.id, teamId));
	});

function useUpdateTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => updateTeam({ data }),
		onMutate: () => {
			const toastId = toast.loading("Updating team...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Team updated successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to update team", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { updateTeam, useUpdateTeamMutation };
