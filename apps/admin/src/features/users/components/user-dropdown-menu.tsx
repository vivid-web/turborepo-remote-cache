import type { User } from "better-auth";

import { Link, useNavigate } from "@tanstack/react-router";
import { EllipsisVerticalIcon, KeyRoundIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth.client";

import { getAvatarFallback } from "../utils";

function UserDropdownMenu({ image, name, email }: User) {
	const navigate = useNavigate();
	const { isMobile } = useSidebar();

	const handleLogOut = async () => {
		await signOut();
		await navigate({ to: "/login" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg grayscale">
						{image && <AvatarImage src={image} alt={name} />}
						<AvatarFallback className="rounded-lg">
							{getAvatarFallback(name)}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{email}
						</span>
					</div>
					<EllipsisVerticalIcon className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							{image && <AvatarImage src={image} alt={name} />}
							<AvatarFallback className="rounded-lg">
								{getAvatarFallback(name)}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{name}</span>
							<span className="truncate text-xs text-muted-foreground">
								{email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to="/account/api-keys">
							<KeyRoundIcon />
							API keys
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						void handleLogOut();
					}}
				>
					<LogOutIcon />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { UserDropdownMenu };
