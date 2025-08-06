import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const InputSchema = z.object({
	userId: IdSchema,
	name: NameSchema,
	email: EmailSchema,
});

const updateUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data: { userId, ...data } }) => {
		await db.update(user).set(data).where(eq(user.id, userId));
	});

function useUpdateUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => updateUser({ data }),
		onMutate: () => {
			const toastId = toast.loading("Saving user details...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("User information saved successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Unable to save user information", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { updateUser, useUpdateUserMutation };
