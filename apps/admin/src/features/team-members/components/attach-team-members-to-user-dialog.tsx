import type { PropsWithChildren } from "react";

import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, isNull, SQL } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { team, teamMember } from "@turborepo-remote-cache/db/schema";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button, ButtonWithPendingState } from "@/components/ui/button";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { IdSchema } from "@/lib/schemas";
import { auth } from "@/middlewares/auth";

import { createMultipleTeamMembers } from "../actions/create-multiple-team-members";
import {
	ATTACH_TEAM_MEMBERS_TO_USER_FORM_ID,
	TEAM_MEMBERS_QUERY_KEY,
} from "../constants";
import { checkTeamMemberDuplicates } from "../queries/check-team-member-duplicates";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	userId: IdSchema,
});

const getAttachableTeamOptionsForUser = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { userId } }) => {
		const joinFilters: Array<SQL> = [];

		joinFilters.push(eq(teamMember.teamId, team.id));
		joinFilters.push(eq(teamMember.userId, userId));

		return db
			.select({ value: team.id, label: team.name })
			.from(team)
			.leftJoin(teamMember, and(...joinFilters))
			.where(isNull(teamMember.teamId))
			.orderBy(asc(team.name));
	});

function attachableTeamOptionsForUserQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAttachableTeamOptionsForUser({ data: params }),
		queryKey: [
			TEAM_MEMBERS_QUERY_KEY,
			"attachable-team-options-for-user",
			params.userId,
		],
	});
}

function AttachTeamMembersToUserDialog({
	children,
	userId,
}: PropsWithChildren<Params>) {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = React.useState(false);

	const query = useSuspenseQuery(
		attachableTeamOptionsForUserQueryOptions({ userId }),
	);

	const form = useAppForm({
		defaultValues: {
			userId,
			teamIds: [] as Array<string>,
		},
		validators: {
			onChange: z.object({
				userId: IdSchema,
				teamIds: IdSchema.array(),
			}),
			onSubmitAsync: async ({ value: { teamIds, userId } }) => {
				const data = teamIds.map((teamId) => ({ userId, teamId }));

				if (await checkTeamMemberDuplicates({ data })) {
					return {
						fields: {
							teamIds: {
								message:
									"Some of the selected teams are already attached to this user.",
							},
						},
					};
				}

				return null;
			},
		},
		onSubmit: async ({ value: { teamIds, userId }, formApi }) => {
			const data = teamIds.map((teamId) => ({ teamId, userId }));

			await createMultipleTeamMembers({ data });

			toast.success("Teams attached successfully");

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
					<DialogTitle>Attach Teams</DialogTitle>
					<DialogDescription>
						Search and attach teams to the current user
					</DialogDescription>
				</DialogHeader>
				<form
					noValidate
					onSubmit={handleSubmit}
					className="grid gap-4"
					id={ATTACH_TEAM_MEMBERS_TO_USER_FORM_ID}
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
						name="teamIds"
						children={(field) => (
							<field.FormItem>
								<field.FormLabel>Search Teams</field.FormLabel>
								<field.FormControl>
									<MultiSelect
										placeholder="Search for teams"
										name={field.name}
										value={field.state.value}
										onChange={(items) => {
											field.handleChange(items);
										}}
										options={query.data}
									/>
								</field.FormControl>
								<field.FormMessage className="text-xs" />
							</field.FormItem>
						)}
					/>
				</form>
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
								form={ATTACH_TEAM_MEMBERS_TO_USER_FORM_ID}
								disabled={!canSubmit}
							>
								Save
							</ButtonWithPendingState>
						)}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

AttachTeamMembersToUserDialog.queryOptions =
	attachableTeamOptionsForUserQueryOptions;

export { AttachTeamMembersToUserDialog };
