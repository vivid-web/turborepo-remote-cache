import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { isNot } from "remeda";
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
import { useAppForm } from "@/components/ui/form-next";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { createApiKeyForAccount } from "../actions/create-api-key-for-account";
import { ADD_NEW_API_KEY_FOR_ACCOUNT_FORM_ID } from "../constants";
import { ExpiresAtSchema, NameSchema } from "../schemas";
import { isValidExpirationDate } from "../utils";

const CreateApiKeySchema = z.object({
	name: NameSchema,
	expiresAt: ExpiresAtSchema,
});

type CreateApiKeyInput = z.input<typeof CreateApiKeySchema>;

function AddNewApiKeyForAccountDialog({ children }: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: {
			name: null,
			expiresAt: null,
		} as CreateApiKeyInput,
		validators: {
			onChange: CreateApiKeySchema,
		},
		onSubmit: async ({ value, formApi }) => {
			await createApiKeyForAccount({ data: value });

			toast.success("API key created successfully");

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
					<DialogTitle>Add New API Key</DialogTitle>
					<DialogDescription>
						Create a new API key for your account.
					</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						id={ADD_NEW_API_KEY_FOR_ACCOUNT_FORM_ID}
					>
						<form.FieldGroup>
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
													disabled={isNot(isValidExpirationDate)}
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
								form={ADD_NEW_API_KEY_FOR_ACCOUNT_FORM_ID}
								disabled={!canSubmit}
							>
								Create API key
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { AddNewApiKeyForAccountDialog };
