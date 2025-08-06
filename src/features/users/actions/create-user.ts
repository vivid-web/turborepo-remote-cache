import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
import { toast } from "sonner";
import { z } from "zod";

import { auth } from "@/middlewares/auth";

import { EmailSchema, NameSchema } from "../schemas";

const InputSchema = z.object({
	name: NameSchema,
	email: EmailSchema,
});

const createUser = createServerFn({ method: "POST" })
	.middleware([auth])
	.validator(InputSchema)
	.handler(async ({ data }) => {
		await db.insert(user).values(data);
	});

function useCreateUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Input) => createUser({ data }),
		onMutate: () => {
			const toastId = toast.loading("Adding new user to system...");

			return { toastId };
		},
		onSuccess: async (_data, _variables, context) => {
			toast.success("User account created successfully", {
				id: context.toastId,
			});

			await queryClient.invalidateQueries();
		},
		onError: (_error, _variables, context) => {
			toast.error("Unable to create user account", {
				id: context?.toastId,
			});
		},
	});
}

type Input = z.infer<typeof InputSchema>;

export { createUser, useCreateUserMutation };
