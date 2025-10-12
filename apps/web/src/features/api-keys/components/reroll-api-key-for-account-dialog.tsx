import { and, eq, SQL } from "@remote-cache/db";
import { apiKey } from "@remote-cache/db/schema";
import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import * as R from "remeda";
import { toast } from "sonner";
import { z } from "zod";

import { Button, ButtonWithPendingState } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/db";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { rerollApiKeyForAccount } from "../actions/reroll-api-key-for-account";
import { API_KEYS_QUERY_KEY, REROLL_API_KEY_FORM_ID } from "../constants";
import { ExpiresAtSchema, NameSchema } from "../schemas";
import { isValidExpirationDate } from "../utils";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({ apiKeyId: IdSchema });

const RerollApiKeySchema = z.object({
	apiKeyId: IdSchema,
	name: NameSchema,
	expiresAt: ExpiresAtSchema,
});

type RerollApiKeyInput = z.input<typeof RerollApiKeySchema>;

const getDefaultValuesForApiKey = createServerFn({ method: "GET" })
	.middleware([auth])
	.inputValidator(ParamsSchema)
	.handler(async ({ data: { apiKeyId }, context: { user } }) => {
		const filters: Array<SQL> = [];

		filters.push(eq(apiKey.id, apiKeyId));
		filters.push(eq(apiKey.userId, user.id));

		const [result] = await db
			.select({
				apiKeyId: apiKey.id,
				name: apiKey.name,
				expiresAt: apiKey.expiresAt,
			})
			.from(apiKey)
			.where(and(...filters))
			.limit(1);

		if (!result) {
			throw notFound();
		}

		if (result.expiresAt && !isValidExpirationDate(result.expiresAt)) {
			result.expiresAt = null;
		}

		return result;
	});

function defaultValuesForApiKeyQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getDefaultValuesForApiKey({ data: params }),
		queryKey: [API_KEYS_QUERY_KEY, "default-values-for-api-key-and-account"],
	});
}

function RerollApiKeyForAccountDialog({
	apiKeyId,
	children,
}: React.PropsWithChildren<Params>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);

	const query = useSuspenseQuery(
		defaultValuesForApiKeyQueryOptions({ apiKeyId }),
	);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: query.data as RerollApiKeyInput,
		validators: {
			onChange: RerollApiKeySchema,
		},
		onSubmit: async ({ value: data }) => {
			await rerollApiKeyForAccount({ data });

			toast.success("API key rerolled successfully");

			await queryClient.invalidateQueries();

			setIsOpen(false);
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
					<DialogTitle>
						Are you sure you want to reroll this API key?
					</DialogTitle>
					<DialogDescription>
						All applications that are using this API key need to be updated
					</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} id={REROLL_API_KEY_FORM_ID}>
						<form.FieldGroup>
							<form.AppField
								name="apiKeyId"
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
												placeholder="My Secret API Key"
												name={field.name}
												value={field.state.value ?? ""}
												onChange={(e) => {
													field.handleChange(e.target.value || null);
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
								name="expiresAt"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Expiration date</field.FieldLabel>
										<Popover
											modal
											open={datePickerOpen}
											onOpenChange={setDatePickerOpen}
										>
											<PopoverTrigger asChild>
												<field.FormControl>
													<Button
														variant={"outline"}
														className="pl-3 text-left font-normal"
													>
														{field.state.value ? (
															format(field.state.value, "PPP")
														) : (
															<span className="text-muted-foreground">
																Pick a date
															</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</field.FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.state.value ?? undefined}
													onSelect={(date) => {
														field.handleChange(date ?? null);

														setDatePickerOpen(false);
													}}
													disabled={R.isNot(isValidExpirationDate)}
													autoFocus
												/>
											</PopoverContent>
										</Popover>
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
								variant="destructive"
								form={REROLL_API_KEY_FORM_ID}
								disabled={!canSubmit}
							>
								Continue
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { RerollApiKeyForAccountDialog };
