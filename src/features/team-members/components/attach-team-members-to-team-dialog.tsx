import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, isNull, SQL } from "drizzle-orm";
import { db } from "drizzle/db";
import { teamMember, user } from "drizzle/schema";
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
	ATTACH_TEAM_MEMBERS_TO_TEAM_FORM_ID,
	TEAM_MEMBERS_QUERY_KEY,
} from "../constants";
import { checkTeamMemberDuplicates } from "../queries/check-team-member-duplicates";

type Params = z.input<typeof ParamsSchema>;

const ParamsSchema = z.object({
	teamId: IdSchema,
});

const getAttachableUserOptionsForTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator(ParamsSchema)
	.handler(async ({ data: { teamId } }) => {
		const joinFilters: Array<SQL> = [];

		joinFilters.push(eq(teamMember.userId, user.id));
		joinFilters.push(eq(teamMember.teamId, teamId));

		return db
			.select({ value: user.id, label: user.name })
			.from(user)
			.leftJoin(teamMember, and(...joinFilters))
			.where(isNull(teamMember.userId))
			.orderBy(asc(user.name));
	});

function attachableUserOptionsForTeamQueryOptions(params: Params) {
	return queryOptions({
		queryFn: async () => getAttachableUserOptionsForTeam({ data: params }),
		queryKey: [
			TEAM_MEMBERS_QUERY_KEY,
			"attached-user-options-for-team",
			params.teamId,
		],
	});
}

function AttachTeamMembersToTeamDialog({
	children,
	teamId,
}: React.PropsWithChildren<Params>) {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = React.useState(false);

	const query = useSuspenseQuery(
		attachableUserOptionsForTeamQueryOptions({ teamId }),
	);

	const form = useAppForm({
		defaultValues: {
			teamId,
			userIds: [] as Array<string>,
		},
		validators: {
			onChange: z.object({
				teamId: IdSchema,
				userIds: IdSchema.array(),
			}),
			onSubmitAsync: async ({ value: { userIds, teamId } }) => {
				const data = userIds.map((userId) => ({ userId, teamId }));

				if (await checkTeamMemberDuplicates({ data })) {
					return {
						fields: {
							userIds: {
								message:
									"Some of the selected users are already attached to this team.",
							},
						},
					};
				}

				return null;
			},
		},
		onSubmit: async ({ value: { teamId, userIds }, formApi }) => {
			const data = userIds.map((userId) => ({ userId, teamId }));

			await createMultipleTeamMembers({ data });

			toast.success("Users attached successfully");

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
					<DialogTitle>Attach Members</DialogTitle>
					<DialogDescription>
						Search and attach members to the team
					</DialogDescription>
				</DialogHeader>
				<form
					noValidate
					onSubmit={handleSubmit}
					className="grid gap-4"
					id={ATTACH_TEAM_MEMBERS_TO_TEAM_FORM_ID}
				>
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
					<form.AppField
						name="userIds"
						children={(field) => (
							<field.FormItem>
								<field.FormLabel>Search Users</field.FormLabel>
								<field.FormControl>
									<MultiSelect
										placeholder="Search for users"
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
								form={ATTACH_TEAM_MEMBERS_TO_TEAM_FORM_ID}
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

AttachTeamMembersToTeamDialog.queryOptions =
	attachableUserOptionsForTeamQueryOptions;

export { AttachTeamMembersToTeamDialog };
