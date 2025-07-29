import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import * as React from "react";
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

import { EDIT_USER_FORM_ID } from "../constants";
import { getDefaultValuesForUserQueryOptions } from "../queries/get-default-values-for-user-query-options";
import { EmailSchema, NameSchema } from "../schemas";
import { checkIfEmailIsTaken } from "../server-fns/check-if-email-is-taken";
import { editUser } from "../server-fns/edit-user";

type Props = React.PropsWithChildren<{
	userId: string;
}>;

function EditUserDialog({ children, userId }: Props) {
	const query = useSuspenseQuery(
		getDefaultValuesForUserQueryOptions({ userId }),
	);

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
			await editUser({ data });

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

export { EditUserDialog };
