import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
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

import { allUsersQueryOptions, totalUsersQueryOptions } from "../-queries";
import { AddNewUserSchema } from "../-schemas";
import { addNewUser, checkIfEmailUnique } from "../-server-fns";

const route = getRouteApi("/_authenticated/users/");

const ADD_NEW_USER_FORM_ID = "add-new-user-form";

function AddNewUserDialog({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();
	const search = route.useSearch();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
		},
		validators: {
			onChange: AddNewUserSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			await addNewUser({ data });

			await Promise.all([
				queryClient.invalidateQueries(allUsersQueryOptions(search)),
				queryClient.invalidateQueries(totalUsersQueryOptions()),
			]);

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
							validators={{
								onSubmitAsync: async ({ value: data }) => {
									if (await checkIfEmailUnique({ data })) {
										return null;
									}

									return {
										message:
											"Email already exists. Please use a different email address.",
									};
								},
							}}
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
							<Button
								type="submit"
								form={ADD_NEW_USER_FORM_ID}
								disabled={!canSubmit}
							>
								{isSubmitting ? (
									<Loader2Icon className="animate-spin" />
								) : (
									"Create user"
								)}
							</Button>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { AddNewUserDialog };
