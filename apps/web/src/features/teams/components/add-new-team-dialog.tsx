import { useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";

import { createTeam } from "../actions/create-team";
import { ADD_NEW_TEAM_FORM_ID } from "../constants";
import { checkIfSlugIsTaken } from "../queries/check-if-slug-is-taken";
import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";
import { slugify } from "../utils";

const AddNewTeamSchema = z.object({
	name: NameSchema,
	slug: SlugSchema,
	description: DescriptionSchema,
});

type AddNewTeamInput = z.input<typeof AddNewTeamSchema>;

function AddNewTeamDialog({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			name: "",
			slug: "",
			description: null,
		} as AddNewTeamInput,
		validators: {
			onChange: AddNewTeamSchema,
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
		onSubmit: async ({ value: data, formApi }) => {
			await createTeam({ data });

			toast.success("Team created successfully");

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
					<form noValidate onSubmit={handleSubmit} id={ADD_NEW_TEAM_FORM_ID}>
						<form.FieldGroup>
							<form.AppField
								name="name"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Name</field.FieldLabel>
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
										<field.FieldError />
									</field.Field>
								)}
							/>
							<form.AppField
								name="slug"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Slug</field.FieldLabel>
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
										<field.FieldError />
									</field.Field>
								)}
							/>
							<form.AppField
								name="description"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Description</field.FieldLabel>
										<field.FormControl>
											<Textarea
												name={field.name}
												value={field.state.value ?? ""}
												onChange={(e) => {
													field.handleChange(e.target.value || null);
												}}
												onBlur={field.handleBlur}
											></Textarea>
										</field.FormControl>
										<field.FieldError />
									</field.Field>
								)}
							/>
						</form.FieldGroup>
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
