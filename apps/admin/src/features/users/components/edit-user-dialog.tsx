import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { notFound, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button, ButtonWithPendingState } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { updateUser } from "../actions/update-user";
import { EDIT_USER_FORM_ID, USERS_QUERY_KEY } from "../constants";
import { checkIfEmailIsTaken } from "../queries/check-if-email-is-taken";
import { EmailSchema, NameSchema } from "../schemas";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getDefaultValuesForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const [foundUser] = await db
			.select({
				userId: user.id,
				email: user.email,
				name: user.name,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!foundUser) {
			throw notFound();
		}

		return foundUser;
	});

function defaultValuesForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getDefaultValuesForUser({ data: params }),
		queryKey: [USERS_QUERY_KEY, "default-values-for-user", params.userId],
	});
}

function EditUserDialog({ children, userId }: React.PropsWithChildren<Params>) {
	const query = useSuspenseQuery(defaultValuesForUserQueryOptions({ userId }));

	const router = useRouter();
	const queryClient = useQueryClient();

	const [isOpen, setIsOpen] = React.useState(false);

	const form = useAppForm({
		defaultValues: {
			...query.data,
		},
		validators: {
			onChange: z.object({
				userId: IdSchema,
				name: NameSchema,
				email: EmailSchema,
			}),
			onSubmitAsync: async ({ value }) => {
				if (await checkIfEmailIsTaken({ data: value })) {
					return {
						fields: {
							email: {
								message:
									"Email already exists. Please use a different email address.",
							},
						},
					};
				}

				return null;
			},
		},
		onSubmit: async ({ value: data, formApi }) => {
			await updateUser({ data });

			toast.success("User updated successfully");

			await queryClient.invalidateQueries();
			await router.invalidate();

			setIsOpen(false);

			formApi.reset();
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>Update user information</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						className="grid gap-4"
						id={EDIT_USER_FORM_ID}
					>
						<form.AppField
							name="userId"
							children={(field) => (
								<input
									type="hidden"
									name={field.name}
									value={field.state.value}
								/>
							)}
						/>

						<form.AppField
							name="name"
							children={(field) => (
								<field.FormItem>
									<field.FormLabel>Name</field.FormLabel>
									<field.FormControl>
										<Input
											placeholder="John Doe"
											name={field.name}
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
											}}
											onBlur={field.handleBlur}
											type="text"
										/>
									</field.FormControl>
									<field.FormMessage className="text-xs" />
								</field.FormItem>
							)}
						/>

						<form.AppField
							name="email"
							children={(field) => (
								<field.FormItem>
									<field.FormLabel>Email</field.FormLabel>
									<field.FormControl>
										<Input
											placeholder="john@doe.com"
											name={field.name}
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
											}}
											onBlur={field.handleBlur}
											type="email"
										/>
									</field.FormControl>
									<field.FormMessage className="text-xs" />
								</field.FormItem>
							)}
						/>
					</form>
				</form.AppForm>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<ButtonWithPendingState
								isPending={isSubmitting}
								type="submit"
								form={EDIT_USER_FORM_ID}
								disabled={!canSubmit}
							>
								Update user
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

EditUserDialog.queryOptions = defaultValuesForUserQueryOptions;

export { EditUserDialog };
