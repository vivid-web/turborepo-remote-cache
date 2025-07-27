import { formatDistance } from "date-fns";
import { ActivityIcon, CalendarIcon, MailIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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

function getAvatarFallback(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("");
}

type Props = {
	createdAt: Date;
	email: string;
	image: null | string;
	lastLoggedInAt?: Date;
	name: string;
};

function UserInfoCard({
	image,
	name,
	email,
	createdAt,
	lastLoggedInAt,
}: Props) {
	return (
		<Card>
			<CardContent>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16">
							{image && <AvatarImage src={image} alt={name} />}
							<AvatarFallback className="text-lg">
								{getAvatarFallback(name)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div>
								<h2 className="text-xl font-semibold text-foreground">
									{name}
								</h2>
								<div className="flex items-center gap-2 text-muted-foreground">
									<MailIcon className="h-4 w-4" />
									<span>{email}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-1 text-right text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							<span>Joined {formatCreatedDate(createdAt)}</span>
						</div>
						<div className="flex items-center gap-2">
							<ActivityIcon className="h-4 w-4" />
							<span>Last login {formatLastLoginDate(lastLoggedInAt)}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { UserInfoCard };
