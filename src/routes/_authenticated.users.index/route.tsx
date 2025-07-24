import { createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { AllUsersCard } from "@/features/users/components/all-users-card";
import { TotalUsersCard } from "@/features/users/components/total-users-card";
import { getAllUsersQueryOptions } from "@/features/users/queries/get-all-users-query-options";
import { getTotalUsersQueryOptions } from "@/features/users/queries/get-total-users-query-options";

export const Route = createFileRoute("/_authenticated/users/")({
	component: RouteComponent,
	validateSearch: z.object({
		query: z.string().optional(),
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps: search }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(getAllUsersQueryOptions(search)),
			context.queryClient.ensureQueryData(getTotalUsersQueryOptions()),
		]);
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const handleSearch = async (query?: string) => {
		await navigate({
			search: (curr) => ({ ...curr, query: query || undefined }),
		});
	};

	return (
		<div className="grid gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
					<p className="text-muted-foreground">
						Manage users and their access to the Turborepo cache
					</p>
				</div>

				<AddUserDialog>
					<Button className="gap-2">
						<PlusCircleIcon className="!h-5 !w-5" />
						Add User
					</Button>
				</AddUserDialog>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<TotalUsersCard />
			</div>

			<AllUsersCard onSearch={handleSearch} {...search} />
		</div>
	);
}
