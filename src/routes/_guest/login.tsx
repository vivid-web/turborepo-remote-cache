import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { FormEvent } from "react";
import { z } from "zod/v4";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/_guest/login")({
	component: RouteComponent,
});

const LoginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

type LoginInput = z.input<typeof LoginSchema>;

function RouteComponent() {
	const mutation = useMutation({
		mutationFn: async (input: LoginInput) => {
			await signIn.email({ ...input, callbackURL: "/" });
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: LoginSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="grid p-0 md:grid-cols-2">
				<form.AppForm>
					<form className="p-6 md:p-8" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold">Welcome back</h1>
								<p className="text-balance text-muted-foreground">
									Login to the Turborepo cache dashboard
								</p>
							</div>
							<form.AppField
								name="email"
								children={(field) => (
									<field.FormItem className="grid gap-3">
										<field.FormLabel>Email</field.FormLabel>
										<field.FormControl>
											<Input
												onBlur={field.handleBlur}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												placeholder="m@example.com"
												required
												type="email"
												value={field.state.value}
											/>
										</field.FormControl>
										<field.FormMessage />
									</field.FormItem>
								)}
							/>

							<form.AppField
								name="password"
								children={(field) => (
									<field.FormItem className="grid gap-3">
										<field.FormLabel>Password</field.FormLabel>{" "}
										<field.FormControl>
											<Input
												onBlur={field.handleBlur}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												required
												type="password"
												value={field.state.value}
											/>
										</field.FormControl>
										<field.FormMessage />
									</field.FormItem>
								)}
							/>

							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button
										className="w-full"
										disabled={!canSubmit}
										type="submit"
									>
										{isSubmitting ? (
											<Loader2Icon className="animate-spin" />
										) : (
											"Login"
										)}
									</Button>
								)}
							/>
						</div>
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
