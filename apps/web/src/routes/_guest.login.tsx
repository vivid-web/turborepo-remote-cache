import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { ButtonWithPendingState } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth.client";

export const Route = createFileRoute("/_guest/login")({
	component: RouteComponent,
});

const LoginFormSchema = z.object({
	email: z.email(),
	password: z.string(),
});

type LoginForm = z.output<typeof LoginFormSchema>;

function RouteComponent() {
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async (params: LoginForm) => {
			await signIn.email(params, { throw: true });
		},
		onSuccess: async () => {
			toast.success("Logged in successfully");

			await navigate({ to: "/" });
		},
		onError: () => {
			form.setErrorMap({
				onChange: {
					fields: {
						email: { message: "Incorrect email or password" },
					},
				},
			});
		},
		onSettled: () => {
			form.resetField("password");
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: LoginFormSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="grid p-0 md:grid-cols-2">
				<form.AppForm>
					<form className="p-6 md:p-8" onSubmit={handleSubmit}>
						<form.FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Welcome back</h1>
								<p className="text-balance text-muted-foreground">
									Login to the remote cache dashboard
								</p>
							</div>
							<form.AppField
								name="email"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Email</field.FieldLabel>
										<field.FormControl>
											<Input
												placeholder="m@example.com"
												name={field.name}
												value={field.state.value}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												onBlur={field.handleBlur}
												type="email"
												required
											/>
										</field.FormControl>
										<field.FieldError />
									</field.Field>
								)}
							/>

							<form.AppField
								name="password"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Password</field.FieldLabel>{" "}
										<field.FormControl>
											<Input
												name={field.name}
												value={field.state.value}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												onBlur={field.handleBlur}
												type="password"
												required
											/>
										</field.FormControl>
										<field.FieldError />
									</field.Field>
								)}
							/>

							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<ButtonWithPendingState
										isPending={isSubmitting}
										className="w-full"
										disabled={!canSubmit}
										type="submit"
									>
										Login
									</ButtonWithPendingState>
								)}
							/>
						</form.FieldGroup>
					</form>
				</form.AppForm>
				<div className="relative hidden bg-muted md:block">
					<img
						alt="Image"
						className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						src="/placeholder.svg"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
