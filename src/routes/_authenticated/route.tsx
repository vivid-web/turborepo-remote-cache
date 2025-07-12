import {
	createFileRoute,
	invariant,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { BoxIcon, DatabaseZapIcon, UserIcon, UsersIcon } from "lucide-react";
import * as React from "react";

import { RouteBreadcrumb } from "@/components/route-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserDropdownMenu } from "@/components/user-dropdown-menu";

export const Route = createFileRoute("/_authenticated")({
	component: PathlessLayoutComponent,
	beforeLoad: ({ context }) => {
		if (context.user) {
			return;
		}

		redirect({ throw: true, to: "/login" });
	},
	loader: ({ context }) => {
		invariant(context.user, "User should be authenticated by now");

		return {
			user: context.user,
			crumb: "Home",
		};
	},
});

function PathlessLayoutComponent() {
	const { user } = Route.useLoaderData();

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<Sidebar collapsible="offcanvas" variant="inset">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								className="data-[slot=sidebar-menu-button]:!p-1.5"
							>
								<Link to="/">
									<DatabaseZapIcon className="!size-5" />
									<span className="text-base font-semibold">
										Turborepo Cache
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent className="flex flex-col gap-2">
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Users" asChild>
										<Link to="/users">
											<UserIcon />
											<span>Users</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Teams" asChild>
										<Link to="/teams">
											<UsersIcon />
											<span>Teams</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Artifacts" asChild>
										<Link to="/artifacts">
											<BoxIcon />
											<span>Artifacts</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<UserDropdownMenu {...user} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
					<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
						<RouteBreadcrumb />
					</div>
				</header>
				<div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
