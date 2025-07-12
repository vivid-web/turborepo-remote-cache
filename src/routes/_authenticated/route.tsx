import {
	IconArchive,
	IconDatabaseSmile,
	IconUser,
	IconUsersGroup,
} from "@tabler/icons-react";
import {
	createFileRoute,
	invariant,
	isMatch,
	Link,
	Outlet,
	redirect,
	useMatches,
} from "@tanstack/react-router";
import { CSSProperties, Fragment } from "react";

import { NavUser } from "@/components/nav-user";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

function Breadcrumbs() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb"),
	);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => (
					<Fragment key={match.id}>
						{index !== 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to={match.fullPath || "/"}>
									{match.loaderData?.crumb}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export const Route = createFileRoute("/_authenticated")({
	component: PathlessLayoutComponent,
	beforeLoad: ({ context }) => {
		if (context.user) {
			return;
		}

		redirect({ throw: true, to: "/login" });
	},
	loader: ({ context }) => {
		invariant(context.user, "User must be authenticated");

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
				} as CSSProperties
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
									<IconDatabaseSmile className="!size-5" />
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
											<IconUser />
											<span>Users</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Teams" asChild>
										<Link to="/teams">
											<IconUsersGroup />
											<span>Teams</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Archives" asChild>
										<Link to="/artifacts">
											<IconArchive />
											<span>Artifacts</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<NavUser {...user} />
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
						<Breadcrumbs />
					</div>
				</header>
				<div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
