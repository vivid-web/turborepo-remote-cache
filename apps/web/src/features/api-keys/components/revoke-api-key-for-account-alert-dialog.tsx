import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ButtonWithPendingState } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form-next";
import { IdSchema } from "@/lib/schemas";

import { revokeApiKeyForAccount } from "../actions/revoke-api-key-for-account";
import { REVOKE_API_KEY_FORM_ID } from "../constants";

function RevokeApiKeyForAccountAlertDialog({
	children,
	apiKeyId,
}: React.PropsWithChildren<{ apiKeyId: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { apiKeyId },
		validators: {
			onSubmit: z.object({ apiKeyId: IdSchema }),
		},
		onSubmit: async ({ value: data }) => {
			await revokeApiKeyForAccount({ data });

			toast.success("API key revoked successfully");

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
		<AlertDialog onOpenChange={setIsOpen} open={isOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to revoke this API key?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} id={REVOKE_API_KEY_FORM_ID}>
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
					</form>
				</form.AppForm>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<ButtonWithPendingState
								isPending={isSubmitting}
								type="submit"
								form={REVOKE_API_KEY_FORM_ID}
								disabled={!canSubmit}
							>
								Continue
							</ButtonWithPendingState>
						)}
					/>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { RevokeApiKeyForAccountAlertDialog };
