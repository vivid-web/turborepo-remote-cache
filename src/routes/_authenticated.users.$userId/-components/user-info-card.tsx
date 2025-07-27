import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { ActivityIcon, CalendarIcon, MailIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { singleUserQueryOptions } from "../-queries";

function formatCreatedDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function formatLastLoginDate(date: Date | undefined) {
	if (!date) {
		return "-";
	}

	return formatDistance(date, new Date(), { addSuffix: true });
}

type Props = {
	userId: string;
};

function UserInfoCard({ userId }: Props) {
	const { data: user } = useSuspenseQuery(singleUserQueryOptions({ userId }));

	return (
		<Card>
			<CardContent>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16">
							{user.image && <AvatarImage src={user.image} alt={user.name} />}
							<AvatarFallback className="text-lg">
								{user.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div>
								<h2 className="text-xl font-semibold text-foreground">
									{user.name}
								</h2>
								<div className="flex items-center gap-2 text-muted-foreground">
									<MailIcon className="h-4 w-4" />
									<span>{user.email}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-1 text-right text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							<span>Joined {formatCreatedDate(user.createdAt)}</span>
						</div>
						<div className="flex items-center gap-2">
							<ActivityIcon className="h-4 w-4" />
							<span>Last login {formatLastLoginDate(user.lastLoggedInAt)}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { UserInfoCard };
