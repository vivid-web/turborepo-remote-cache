import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

const InputSchema = z.object({ userId: IdSchema });

const deleteUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data }) => {
		await db.delete(user).where(eq(user.id, data.userId));
	});

function useDeleteUserMutation() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();

	return useMutation({
		mutationFn: async (data: Input) => deleteUser({ data }),
		onMutate: () => {
			const toastId = toast.loading("Deleting user...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("User deleted successfully", {
				id: context.toastId,
			});

			if (matchRoute({ to: "/users/$userId" })) {
				await navigate({ to: "/users" });
			}

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Failed to delete user", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { deleteUser, useDeleteUserMutation };
