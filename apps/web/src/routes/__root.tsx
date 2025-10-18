import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtools as ReactFormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth.server";
import appCss from "@/styles/app.css?url";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const headers = getRequestHeaders();

	const session = await auth.api.getSession({ headers });

	return session?.user ?? null;
});

const createRootRoute = wrapCreateRootRouteWithSentry(
	createRootRouteWithContext<{ queryClient: QueryClient }>(),
);

export const Route = createRootRoute({
	beforeLoad: async () => {
		const user = await fetchUser();

		return { user };
	},
	head: () => ({
		links: [{ rel: "stylesheet", href: appCss }],
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "TanStack Start Starter" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Toaster />
				<Scripts />
				<TanStackDevtools
					plugins={[
						{
							name: "TanStack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "TanStack Form",
							render: <ReactFormDevtoolsPanel />,
						},
					]}
				/>
			</body>
		</html>
	);
}
