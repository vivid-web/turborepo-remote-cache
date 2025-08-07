import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const InputSchema = z.object({
	name: NameSchema,
	slug: SlugSchema,
	description: DescriptionSchema.optional(),
});

const createTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data }) => {
		await db.insert(team).values(data);
	});

function useCreateTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => createTeam({ data }),
		onMutate: () => {
			const toastId = toast.loading("Creating team...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Team created successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to create team", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { createTeam, useCreateTeamMutation };
