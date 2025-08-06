import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

const createTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(
		z.object({
			name: NameSchema,
			slug: SlugSchema,
			description: DescriptionSchema.optional(),
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(team).values(data);
	});

function useCreateTeamMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTeam,
		onMutate: () => {
			const toastId = toast.loading("Creating team...");

			return { toastId };
		},
		onSuccess: async (_, __, context) => {
			toast.success("Team created successfully", { id: context.toastId });

			await queryClient.invalidateQueries();
		},
		onError: (_, __, context) => {
			toast.error("Failed to create team", { id: context?.toastId });
		},
	});
}

export { createTeam, useCreateTeamMutation };
