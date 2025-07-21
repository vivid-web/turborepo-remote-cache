import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { IdSchema } from "@/lib/schemas";

import { removeTeam } from "../-server-fns";

const REMOVE_TEAM_FORM_ID = "remove-team-form";

function RemoveTeamAlertDialog({
	children,
	id,
}: React.PropsWithChildren<{ id: string }>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const form = useAppForm({
		defaultValues: { id },
		validators: {
			onSubmit: z.object({ id: IdSchema }),
		},
		onSubmit: async ({ value: data }) => {
			await removeTeam({ data });

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
								form={REMOVE_TEAM_FORM_ID}
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

export { RemoveTeamAlertDialog };
