import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { notFound, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";
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
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";
import { EmailSchema, NameSchema } from "../schemas";
import { checkIfEmailIsTaken } from "../server-fns/check-if-email-is-taken";
import { editUser } from "../server-fns/edit-user";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getSettingsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
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

function settingsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getSettingsForUser({ data: params }),
		queryKey: [USERS_QUERY_KEY, "settings-for-user", params.userId],
	});
}

function UserSettingsCard({ userId }: Params) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: user } = useSuspenseQuery(
		settingsForUserQueryOptions({ userId }),
	);

	const form = useAppForm({
		defaultValues: {
			userId: user.userId,
			name: user.name,
			email: user.email,
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

			toast.success("User settings updated successfully");

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
				<CardTitle className="font-medium">User Settings</CardTitle>
				<CardDescription>Manage user settings and preferences</CardDescription>
			</CardHeader>
			<CardContent>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} className="grid gap-4">
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

UserSettingsCard.queryOptions = settingsForUserQueryOptions;

export { UserSettingsCard };
