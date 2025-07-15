import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

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
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";

import { RemoveUserSchema } from "../-schemas";
import { removeUser } from "../-server-fns";

const REMOVE_USER_FORM_ID = "remove-user-form";

function RemoveUserAlertDialog({
	children,
	id,
}: React.PropsWithChildren<{ id: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { id },
		validators: {
			onSubmit: RemoveUserSchema,
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
							name="id"
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
							<Button
								type="submit"
								form={REMOVE_USER_FORM_ID}
								disabled={!canSubmit}
							>
								{isSubmitting ? (
									<Loader2Icon className="animate-spin" />
								) : (
									"Continue"
								)}
							</Button>
						)}
					/>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { RemoveUserAlertDialog };
