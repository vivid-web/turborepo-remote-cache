import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { notFound, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { ButtonWithPendingState } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/features/teams/utils";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { editTeam } from "../actions/edit-team";
import { TEAMS_QUERY_KEY } from "../constants";
import { checkIfSlugIsTaken } from "../queries/check-if-slug-is-taken";
import { DescriptionSchema, NameSchema, SlugSchema } from "../schemas";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getSettingsForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
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

function settingsForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getSettingsForTeam({ data: params }),
		queryKey: [TEAMS_QUERY_KEY, "settings-for-team", params.teamId],
	});
}

function TeamSettingsCard({ teamId }: Params) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const query = useSuspenseQuery(settingsForTeamQueryOptions({ teamId }));

	const form = useAppForm({
		defaultValues: {
			...query.data,
			description: query.data.description ?? "",
		},
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
		onSubmit: async ({ value, formApi }) => {
			const data = {
				...value,
				description: value.description || undefined,
			};

			await editTeam({ data });

			toast.success("Team settings updated successfully");

			await queryClient.invalidateQueries();
			await router.invalidate();

			formApi.reset();
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-medium">Team Settings</CardTitle>
				<CardDescription>Manage team settings</CardDescription>
			</CardHeader>
			<CardContent>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} className="grid gap-4">
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

						<div className="flex justify-start">
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<ButtonWithPendingState
										type="submit"
										disabled={!canSubmit}
										isPending={isSubmitting}
									>
										Save changes
									</ButtonWithPendingState>
								)}
							/>
						</div>
					</form>
				</form.AppForm>
			</CardContent>
		</Card>
	);
}

TeamSettingsCard.queryOptions = settingsForTeamQueryOptions;

export { TeamSettingsCard };
