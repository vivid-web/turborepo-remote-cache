import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import {
	ActivityIcon,
	ArchiveIcon,
	CrownIcon,
	DownloadIcon,
	EditIcon,
	FileTextIcon,
	ImageIcon,
	MoreHorizontalIcon,
	PlusIcon,
	ShieldIcon,
	Trash2Icon,
	TrendingUpIcon,
	UserIcon,
	UserPlusIcon,
	UsersIcon,
	VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod/v4";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/middlewares/auth";

// Mock data
const teamData = {
	id: "team-001",
	name: "Design System Team",
	description:
		"Responsible for maintaining and evolving the company's design system and component library.",
	createdAt: "2024-01-15",
	memberCount: 8,
	projectCount: 12,
	status: "active",
};

const membersData = [
	{
		id: "1",
		name: "Sarah Johnson",
		email: "sarah.johnson@company.com",
		role: "Team Lead",
		avatar: "/placeholder.svg?height=32&width=32",
		joinedAt: "2024-01-15",
		status: "active",
	},
	{
		id: "2",
		name: "Mike Chen",
		email: "mike.chen@company.com",
		role: "Senior Designer",
		avatar: "/placeholder.svg?height=32&width=32",
		joinedAt: "2024-02-01",
		status: "active",
	},
	{
		id: "3",
		name: "Emily Rodriguez",
		email: "emily.rodriguez@company.com",
		role: "Developer",
		avatar: "/placeholder.svg?height=32&width=32",
		joinedAt: "2024-02-15",
		status: "active",
	},
	{
		id: "4",
		name: "David Kim",
		email: "david.kim@company.com",
		role: "Designer",
		avatar: "/placeholder.svg?height=32&width=32",
		joinedAt: "2024-03-01",
		status: "inactive",
	},
];

const statsData = {
	totalProjects: 12,
	activeProjects: 8,
	completedProjects: 4,
	totalFiles: 156,
	storageUsed: "2.4 GB",
	lastActivity: "2 hours ago",
};

const filesData = [
	{
		id: "1",
		name: "Design System Guidelines.pdf",
		type: "pdf",
		size: "2.4 MB",
		uploadedBy: "Sarah Johnson",
		uploadedAt: "2024-03-15",
		downloads: 23,
	},
	{
		id: "2",
		name: "Component Library.fig",
		type: "figma",
		size: "15.2 MB",
		uploadedBy: "Mike Chen",
		uploadedAt: "2024-03-14",
		downloads: 45,
	},
	{
		id: "3",
		name: "Brand Assets.zip",
		type: "archive",
		size: "8.7 MB",
		uploadedBy: "Emily Rodriguez",
		uploadedAt: "2024-03-12",
		downloads: 12,
	},
	{
		id: "4",
		name: "Demo Video.mp4",
		type: "video",
		size: "45.1 MB",
		uploadedBy: "David Kim",
		uploadedAt: "2024-03-10",
		downloads: 8,
	},
];

const getFileIcon = (type: string) => {
	switch (type) {
		case "archive":
			return <ArchiveIcon className="h-4 w-4" />;
		case "figma":
			return <ImageIcon className="h-4 w-4" />;
		case "pdf":
			return <FileTextIcon className="h-4 w-4" />;
		case "video":
			return <VideoIcon className="h-4 w-4" />;
		default:
			return <FileTextIcon className="h-4 w-4" />;
	}
};

const getRoleIcon = (role: string) => {
	switch (role.toLowerCase()) {
		case "senior designer":
			return <ShieldIcon className="h-4 w-4 text-blue-500" />;
		case "team lead":
			return <CrownIcon className="h-4 w-4 text-yellow-500" />;
		default:
			return <UserIcon className="h-4 w-4 text-gray-500" />;
	}
};
const TeamIdSchema = z.string().min(1);

const fetchTeam = createServerFn({ method: "GET" })
	.middleware([auth])
	.validator((teamId: unknown) => TeamIdSchema.parse(teamId))
	.handler(async ({ data: teamId }) => {
		const team = await db.query.team.findFirst({
			where: (team, { eq }) => eq(team.id, teamId),
			columns: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!team) {
			throw notFound();
		}

		return team;
	});

function teamQueryOptions(teamId: string) {
	return queryOptions({
		queryFn: async () => fetchTeam({ data: teamId }),
		queryKey: ["teams", teamId],
	});
}

export const Route = createFileRoute("/_authenticated/teams/$teamId")({
	component: RouteComponent,
	params: {
		parse: (params) => ({
			teamId: TeamIdSchema.parse(params.teamId),
		}),
	},
	loader: async ({ context, params: { teamId } }) => {
		const team = await context.queryClient.ensureQueryData(
			teamQueryOptions(teamId),
		);

		return {
			crumb: team.name,
		};
	},
});

function RouteComponent() {
	const { teamId } = Route.useParams();

	const teamQuery = useSuspenseQuery(teamQueryOptions(teamId));

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
	const [teamName, setTeamName] = useState(teamData.name);
	const [teamDescription, setTeamDescription] = useState(teamData.description);

	const handleUpdateTeam = () => {
		// Handle team update logic here
		setIsEditDialogOpen(false);
	};

	const handleDeleteTeam = () => {
		// Handle team deletion logic here
		console.log("Team deleted");
	};

	const handleAddMember = () => {
		// Handle add member logic here
		setIsAddMemberDialogOpen(false);
	};

	const handleRemoveMember = (memberId: string) => {
		// Handle remove member logic here
		console.log("Remove member:", memberId);
	};

	return (
		<div className="container mx-auto space-y-6 py-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<h1 className="text-3xl font-bold">{teamQuery.data.name}</h1>
						<Badge
							variant={teamData.status === "active" ? "default" : "secondary"}
						>
							{teamData.status}
						</Badge>
					</div>
					<p className="text-muted-foreground">{teamQuery.data.description}</p>
				</div>
				<div className="flex items-center gap-2">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm">
								<EditIcon className="mr-2 h-4 w-4" />
								Edit Team
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Team</DialogTitle>
								<DialogDescription>
									Update the team information below.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="team-name">Team Name</Label>
									<Input
										id="team-name"
										value={teamName}
										onChange={(e) => {
											setTeamName(e.target.value);
										}}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="team-description">Description</Label>
									<Textarea
										id="team-description"
										value={teamDescription}
										onChange={(e) => {
											setTeamDescription(e.target.value);
										}}
										rows={3}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => {
										setIsEditDialogOpen(false);
									}}
								>
									Cancel
								</Button>
								<Button onClick={handleUpdateTeam}>Save Changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="sm">
								<Trash2Icon className="mr-2 h-4 w-4" />
								Delete Team
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									team and remove all associated data.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteTeam}
									className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
								>
									Delete Team
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{/* Main Content */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="stats">Statistics</TabsTrigger>
					<TabsTrigger value="files">Files</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Members
								</CardTitle>
								<UsersIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{teamData.memberCount}</div>
								<p className="text-xs text-muted-foreground">
									+2 from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active Projects
								</CardTitle>
								<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{statsData.activeProjects}
								</div>
								<p className="text-xs text-muted-foreground">
									{statsData.totalProjects} total projects
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Storage Used
								</CardTitle>
								<ArchiveIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{statsData.storageUsed}
								</div>
								<p className="text-xs text-muted-foreground">
									{statsData.totalFiles} files
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Last Activity
								</CardTitle>
								<ActivityIcon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{statsData.lastActivity}
								</div>
								<p className="text-xs text-muted-foreground">Team activity</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Team Information</CardTitle>
							<CardDescription>General details about the team</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<Label className="text-sm font-medium">Team ID</Label>
									<p className="text-sm text-muted-foreground">
										{teamQuery.data.id}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium">Created Date</Label>
									<p className="text-sm text-muted-foreground">
										{teamQuery.data.createdAt.toLocaleDateString()}
									</p>
								</div>
								<div>
									<Label className="text-sm font-medium">Status</Label>
									<Badge
										variant={
											teamData.status === "active" ? "default" : "secondary"
										}
										className="ml-2"
									>
										{teamData.status}
									</Badge>
								</div>
								<div>
									<Label className="text-sm font-medium">Project Count</Label>
									<p className="text-sm text-muted-foreground">
										{teamData.projectCount}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Members Tab */}
				<TabsContent value="members" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium">Team Members</h3>
						<Dialog
							open={isAddMemberDialogOpen}
							onOpenChange={setIsAddMemberDialogOpen}
						>
							<DialogTrigger asChild>
								<Button>
									<UserPlusIcon className="mr-2 h-4 w-4" />
									Add Member
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Team Member</DialogTitle>
									<DialogDescription>
										Invite a new member to join the team.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="member-email">Email Address</Label>
										<Input
											id="member-email"
											type="email"
											placeholder="Enter email address"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="member-role">Role</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="designer">Designer</SelectItem>
												<SelectItem value="developer">Developer</SelectItem>
												<SelectItem value="senior-designer">
													Senior Designer
												</SelectItem>
												<SelectItem value="team-lead">Team Lead</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => {
											setIsAddMemberDialogOpen(false);
										}}
									>
										Cancel
									</Button>
									<Button onClick={handleAddMember}>Send Invitation</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					<Card>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Member</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Joined</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{membersData.map((member) => (
									<TableRow key={member.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={member.avatar || "/placeholder.svg"}
														alt={member.name}
													/>
													<AvatarFallback>
														{member.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{member.name}</p>
													<p className="text-sm text-muted-foreground">
														{member.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getRoleIcon(member.role)}
												{member.role}
											</div>
										</TableCell>
										<TableCell>
											{new Date(member.joinedAt).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													member.status === "active" ? "default" : "secondary"
												}
											>
												{member.status}
											</Badge>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontalIcon className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>Edit Role</DropdownMenuItem>
													<DropdownMenuItem>View Profile</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => {
															handleRemoveMember(member.id);
														}}
													>
														Remove Member
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</TabsContent>

				{/* Statistics Tab */}
				<TabsContent value="stats" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Project Statistics</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm">Total Projects</span>
									<span className="font-medium">{statsData.totalProjects}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Active Projects</span>
									<span className="font-medium">
										{statsData.activeProjects}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Completed Projects</span>
									<span className="font-medium">
										{statsData.completedProjects}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Storage Usage</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm">Total Files</span>
									<span className="font-medium">{statsData.totalFiles}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Storage Used</span>
									<span className="font-medium">{statsData.storageUsed}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Storage Limit</span>
									<span className="font-medium">10 GB</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base">Team Activity</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm">Last Activity</span>
									<span className="font-medium">{statsData.lastActivity}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">Active Members</span>
									<span className="font-medium">6</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm">This Month</span>
									<span className="font-medium">24 actions</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Files Tab */}
				<TabsContent value="files" className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium">Team Files</h3>
						<Button>
							<PlusIcon className="mr-2 h-4 w-4" />
							Upload File
						</Button>
					</div>

					<Card>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Size</TableHead>
									<TableHead>Uploaded By</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Downloads</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filesData.map((file) => (
									<TableRow key={file.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												{getFileIcon(file.type)}
												<span className="font-medium">{file.name}</span>
											</div>
										</TableCell>
										<TableCell>{file.size}</TableCell>
										<TableCell>{file.uploadedBy}</TableCell>
										<TableCell>
											{new Date(file.uploadedAt).toLocaleDateString()}
										</TableCell>
										<TableCell>{file.downloads}</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontalIcon className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														<DownloadIcon className="mr-2 h-4 w-4" />
														Download
													</DropdownMenuItem>
													<DropdownMenuItem>Share</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-destructive">
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
