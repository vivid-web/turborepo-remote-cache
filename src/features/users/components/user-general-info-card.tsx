import { useSuspenseQuery } from "@tanstack/react-query";
import { ActivityIcon, CalendarIcon, MailIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { getUserGeneralInfoQueryOptions } from "../queries/get-user-general-info-query-options";
import {
	formatCreatedDate,
	formatLastLoginDate,
	getAvatarFallback,
} from "../utils";

type Props = {
	userId: string;
};

function UserGeneralInfoCard({ userId }: Props) {
	const { data } = useSuspenseQuery(getUserGeneralInfoQueryOptions({ userId }));

	return (
		<Card>
			<CardContent>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16">
							{data.image && <AvatarImage src={data.image} alt={data.name} />}
							<AvatarFallback className="text-lg">
								{getAvatarFallback(data.name)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div>
								<h2 className="text-xl font-semibold text-foreground">
									{data.name}
								</h2>
								<div className="flex items-center gap-2 text-muted-foreground">
									<MailIcon className="h-4 w-4" />
									<span>{data.email}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-1 text-right text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							<span>Joined {formatCreatedDate(data.createdAt)}</span>
						</div>
						<div className="flex items-center gap-2">
							<ActivityIcon className="h-4 w-4" />
							<span>Last login {formatLastLoginDate(data.lastLoggedInAt)}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { UserGeneralInfoCard };
