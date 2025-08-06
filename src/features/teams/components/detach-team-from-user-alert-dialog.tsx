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
import { useAppForm } from "@/components/ui/form";
import { DETACH_TEAM_FROM_USER_FORM_ID } from "@/features/teams/constants";
import { detachUserFromTeam } from "@/features/users/actions/detach-user-from-team";
import { IdSchema } from "@/lib/schemas";

function DetachTeamFromUserAlertDialog({
	userId,
	teamId,
	children,
}: React.PropsWithChildren<{
	teamId: string;
	userId: string;
}>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { userId, teamId },
		validators: {
			onSubmit: z.object({
				teamId: IdSchema,
				userId: IdSchema,
			}),
		},
		onSubmit: async ({ value: data }) => {
			await detachUserFromTeam({ data });

			toast.success("Team detached successfully");

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
						Are you sure you want to detach this team from the current user?
					</AlertDialogTitle>
					<AlertDialogDescription>
						You will have to attach the team to the user again
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form.AppForm>
					<form
						noValidate
						onSubmit={handleSubmit}
						className="grid gap-4"
						id={DETACH_TEAM_FROM_USER_FORM_ID}
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
								form={DETACH_TEAM_FROM_USER_FORM_ID}
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

export { DetachTeamFromUserAlertDialog };
