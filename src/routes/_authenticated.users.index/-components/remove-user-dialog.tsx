import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import * as React from "react";
import { PropsWithChildren } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppForm } from "@/components/ui/form";

import { allUsersQueryOptions, totalUsersQueryOptions } from "../-queries";
import { RemoveUserSchema } from "../-schemas";
import { removeUser } from "../-server-fns";

const route = getRouteApi("/_authenticated/users/");

const REMOVE_USER_FORM_ID = "remove-user-form";

function RemoveUserDialog({ children, id }: PropsWithChildren<{ id: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();
	const search = route.useSearch();

	const form = useAppForm({
		defaultValues: { id },
		validators: {
			onSubmit: RemoveUserSchema,
		},
		onSubmit: async ({ value: data }) => {
			await removeUser({ data });

			await Promise.all([
				queryClient.invalidateQueries(allUsersQueryOptions(search)),
				queryClient.invalidateQueries(totalUsersQueryOptions()),
			]);

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
								<field.FormControl>
									<input type="hidden" value={field.state.value} />
								</field.FormControl>
							)}
						/>
					</form>
				</form.AppForm>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<AlertDialogAction
								type="submit"
								form={REMOVE_USER_FORM_ID}
								disabled={!canSubmit}
							>
								{isSubmitting ? (
									<Loader2Icon className="animate-spin" />
								) : (
									"Continue"
								)}
							</AlertDialogAction>
						)}
					/>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { RemoveUserDialog };
