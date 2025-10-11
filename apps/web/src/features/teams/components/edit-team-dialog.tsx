import { eq } from "@remote-cache/db";
import { team } from "@remote-cache/db/schema";
import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { updateTeam } from "../actions/update-team";
import { EDIT_TEAM_FORM_ID, TEAMS_QUERY_KEY } from "../constants";
import { checkIfSlugIsTaken } from "../queries/check-if-slug-is-taken";
import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";
import { slugify } from "../utils";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({ teamId: IdSchema });

const getDefaultValuesForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		const [foundTeam] = await db
			.select({
				teamId: team.id,
				name: team.name,
				slug: team.slug,
				description: team.description,
			})
			.from(team)
			.where(eq(team.id, teamId))
			.limit(1);

		if (!foundTeam) {
			throw notFound();
		}

		return foundTeam;
	});

function defaultValuesForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getDefaultValuesForTeam({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "default-values-for-team", params.teamId],
	});
}

function EditTeamDialog({ children, teamId }: React.PropsWithChildren<Params>) {
	const query = useSuspenseQuery(defaultValuesForTeamQueryOptions({ teamId }));

	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: query.data,
		validators: {
			onChange: z.object({
				teamId: IdSchema,
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
		onSubmit: async ({ value: data, formApi }) => {
			await updateTeam({ data });

			toast.success("Team updated successfully");

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
					<DialogTitle>Add Team</DialogTitle>
					<DialogDescription>Update team information</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} id={EDIT_TEAM_FORM_ID}>
						<form.FieldGroup>
							<form.AppField
								name="teamId"
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
								form={EDIT_TEAM_FORM_ID}
								disabled={!canSubmit}
							>
								Update team
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

EditTeamDialog.queryOptions = defaultValuesForTeamQueryOptions;

export { EditTeamDialog };
