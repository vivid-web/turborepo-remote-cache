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
import { Textarea } from "@/components/ui/textarea";

import { ADD_NEW_TEAM_FORM_ID } from "../constants";
import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";
import { addNewTeam } from "../server-fns/add-new-team";
import { checkIfSlugIsTaken } from "../server-fns/check-if-slug-is-taken";
import { slugify } from "../utils";

function AddNewTeamDialog({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			name: "",
			slug: "",
			description: "",
		},
		validators: {
			onChange: z.object({
				name: NameSchema,
				slug: SlugSchema,
				description: DescriptionSchema,
			}),
			onSubmitAsync: async ({ value }) => {
				if (await checkIfSlugIsTaken({ data: value })) {
					return {
						fields: {
							slug: {
								message: "Slug already exists. Please use a different slug.",
							},
						},
					};
				}

				return null;
			},
		},
		onSubmit: async ({ value, formApi }) => {
			const data = {
				...value,
				description: value.description || undefined,
			};

			await addNewTeam({ data });

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
					<DialogTitle>Add New Team</DialogTitle>
					<DialogDescription>Create a new team.</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						className="grid gap-4"
						id={ADD_NEW_TEAM_FORM_ID}
					>
						<form.AppField
							name="name"
							children={(field) => (
								<field.FormItem>
									<field.FormLabel>Name</field.FormLabel>
									<field.FormControl>
										<Input
											placeholder="Dream Team"
											name={field.name}
											value={field.state.value}
											onChange={(e) => {
												const value = e.target.value;

												field.handleChange(value);
												form.setFieldValue("slug", slugify(value));
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
							name="slug"
							children={(field) => (
								<field.FormItem>
									<field.FormLabel>Slug</field.FormLabel>
									<field.FormControl>
										<Input
											placeholder="dream-team"
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
							name="description"
							children={(field) => (
								<field.FormItem>
									<field.FormLabel>Description</field.FormLabel>
									<field.FormControl>
										<Textarea
											name={field.name}
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
											}}
											onBlur={field.handleBlur}
										></Textarea>
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
								form={ADD_NEW_TEAM_FORM_ID}
								disabled={!canSubmit}
							>
								Create team
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { AddNewTeamDialog };
