import { createFileRoute } from "@tanstack/react-router";
import { UserPlusIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { AddNewUserDialog } from "./-components/add-new-user-dialog";
import { AllUsersCard } from "./-components/all-users-card";
import { TotalUsersCard } from "./-components/total-users-card";
import { allUsersQueryOptions, totalUsersQueryOptions } from "./-queries";

const SearchSchema = z.object({
	query: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/users/")({
	component: RouteComponent,
	validateSearch: SearchSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps: search }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(allUsersQueryOptions(search)),
			context.queryClient.ensureQueryData(totalUsersQueryOptions()),
		]);
	},
});

function RouteComponent() {
	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
					<p className="text-muted-foreground">
						Manage users and their access to the Turborepo cache
					</p>
				</div>
				<AddNewUserDialog>
					<Button className="gap-2">
						<UserPlusIcon className="h-4 w-4" />
						Add User
					</Button>
				</AddNewUserDialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersCard />
			</div>

			<AllUsersCard />
		</div>
	);
}
