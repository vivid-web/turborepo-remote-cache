import * as React from 'react'
import {createRootRoute, HeadContent, Outlet, Scripts,} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{charSet: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{title: 'TanStack Start Starter'},
		],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet/>
		</RootDocument>
	)
}

function RootDocument({children}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html>
		<head>
			<HeadContent/>
		</head>
		<body>
		{children}
		<TanStackRouterDevtools position="bottom-right"/>
		<Scripts/>
		</body>
		</html>
	)
}