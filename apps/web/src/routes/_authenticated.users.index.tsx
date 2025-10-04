import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AllUsersCard } from "@/features/users/components/all-users-card";
import { TotalUsersCard } from "@/features/users/components/total-users-card";
import { QuerySchema } from "@/features/users/schemas";

const { AddNewUserDialog } = lazily(
	() => import("@/features/users/components/add-new-user-dialog"),
);

export const Route = createFileRoute("/_authenticated/users/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: QuerySchema.optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context: { queryClient }, deps: search }) => {
		await Promise.all([
			queryClient.ensureQueryData(AllUsersCard.queryOptions(search)),
			queryClient.ensureQueryData(TotalUsersCard.queryOptions()),
		]);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query }),
		});
	};

	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
					<p className="text-muted-foreground">
						Manage users and their access to the remote cache
					</p>
				</div>
				<React.Suspense
					fallback={
						<Button className="gap-2" disabled>
							<Spinner />
							Add User
						</Button>
					}
				>
					<AddNewUserDialog>
						<Button className="gap-2">
							<PlusCircleIcon className="!h-5 !w-5" />
							Add User
						</Button>
					</AddNewUserDialog>
				</React.Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersCard />
			</div>

			<AllUsersCard query={search.query} onSearch={handleSearch} />
		</div>
	);
}
