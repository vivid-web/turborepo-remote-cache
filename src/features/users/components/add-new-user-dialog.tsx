import { useQueryClient } from "@tanstack/react-query";
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

import { ADD_NEW_USER_FORM_ID } from "../constants";
import { EmailSchema, NameSchema } from "../schemas";
import { addNewUser } from "../server-fns/add-new-user";
import { checkIfEmailIsTaken } from "../server-fns/check-if-email-is-taken";

function AddNewUserDialog({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
		},
		validators: {
			onChange: z.object({
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
			await addNewUser({ data });

			await queryClient.invalidateQueries();

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
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>Create a new user account.</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						className="grid gap-4"
						id={ADD_NEW_USER_FORM_ID}
					>
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
								form={ADD_NEW_USER_FORM_ID}
								disabled={!canSubmit}
							>
								Create user
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { AddNewUserDialog };
