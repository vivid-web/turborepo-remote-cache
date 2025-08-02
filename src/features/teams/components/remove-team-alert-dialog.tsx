import { useQueryClient } from "@tanstack/react-query";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
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

import { REMOVE_TEAM_FORM_ID } from "../constants";
import { removeTeam } from "../server-fns/remove-team";

function RemoveTeamAlertDialog({
	children,
	teamId,
}: React.PropsWithChildren<{ teamId: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);
	const navigate = useNavigate();
	const matchRoute = useMatchRoute();

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { teamId },
		validators: {
			onSubmit: z.object({ teamId: IdSchema }),
		},
		onSubmit: async ({ value: data }) => {
			await removeTeam({ data });

			if (matchRoute({ to: "/teams/$teamId" })) {
				await navigate({ to: "/teams" });
			}

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
						Are you sure you want to remove this team?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. All data associated with this team
						will be permanently deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form.AppForm>
					<form noValidate onSubmit={handleSubmit} id={REMOVE_TEAM_FORM_ID}>
						<form.AppField
							name="teamId"
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
								form={REMOVE_TEAM_FORM_ID}
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

export { RemoveTeamAlertDialog };
