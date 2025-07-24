import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

import { singleUserQueryOptions } from "../-queries";
import { EmailSchema, NameSchema } from "../-schemas";
import { checkIfEmailUnique, editUser } from "../-server-fns";

const route = getRouteApi("/_authenticated/users/$userId");

function UserSettingsCard() {
	const router = useRouter();
	const params = route.useParams();
	const queryClient = useQueryClient();

	const { data: user } = useSuspenseQuery(singleUserQueryOptions(params));

	const form = useAppForm({
		defaultValues: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
		validators: {
			onChange: z.object({
				id: IdSchema,
				name: NameSchema,
				email: EmailSchema,
			}),
			onSubmitAsync: async ({ value }) => {
				if (await checkIfEmailUnique({ data: value })) {
					return null;
				}

				return {
					fields: {
						email: {
							message:
								"Email already exists. Please use a different email address.",
						},
					},
				};
			},
		},
		onSubmit: async ({ value: data, formApi }) => {
			await editUser({ data });

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
							name="id"
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

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button type="submit" disabled={!canSubmit}>
									{isSubmitting ? (
										<Loader2Icon className="animate-spin" />
									) : (
										"Save changes"
									)}
								</Button>
							)}
						/>
					</form>
				</form.AppForm>
			</CardContent>
		</Card>
	);
}

export { UserSettingsCard };
