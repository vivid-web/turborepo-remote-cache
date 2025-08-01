import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
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
import { useAppForm } from "@/components/ui/form";
import { IdSchema } from "@/lib/schemas";

import { REMOVE_USER_FORM_ID } from "../constants";
import { removeUser } from "../server-fns/remove-user";

function RemoveUserAlertDialog({
	children,
	userId,
}: React.PropsWithChildren<{ userId: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { userId },
		validators: {
			onSubmit: z.object({
				userId: IdSchema,
			}),
		},
		onSubmit: async ({ value: data }) => {
			await removeUser({ data });

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
						Are you sure you want to remove this user?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						selected user
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						className="grid gap-4"
						id={REMOVE_USER_FORM_ID}
					>
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
								form={REMOVE_USER_FORM_ID}
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

export { RemoveUserAlertDialog };
