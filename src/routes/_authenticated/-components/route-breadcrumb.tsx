import { isMatch, Link, useMatches } from "@tanstack/react-router";
import * as React from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function RouteBreadcrumb() {
	const matches = useMatches();

	const matchesWithCrumbs = React.useMemo(
		() => matches.filter((match) => isMatch(match, "loaderData.crumb")),
		[matches],
	);

	if (matches.some((match) => match.status === "pending")) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => (
					<React.Fragment key={match.id}>
						{index !== 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to={match.fullPath || "/"}>
									{match.loaderData?.crumb}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export { RouteBreadcrumb };
