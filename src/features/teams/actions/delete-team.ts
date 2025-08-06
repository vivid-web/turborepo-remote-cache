import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const InputSchema = z.object({
	teamId: IdSchema,
});

const deleteTeam = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data }) => {
		await db.delete(team).where(eq(team.id, data.teamId));
	});

function useDeleteTeamMutation() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();

	return useMutation({
		mutationFn: async (data: Input) => deleteTeam({ data }),
		onMutate: () => {
			const toastId = toast.loading("Removing team workspace...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("Team workspace deleted successfully", {
				id: context.toastId,
			});

			if (matchRoute({ to: "/teams/$teamId" })) {
				await navigate({ to: "/teams" });
			}

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Unable to delete team workspace", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { deleteTeam, useDeleteTeamMutation };
