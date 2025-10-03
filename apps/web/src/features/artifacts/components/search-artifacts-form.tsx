import {
	getRouteApi,
	type RegisteredRouter,
	type RouteIds,
	useNavigate,
} from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { useAppForm } from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

import { QuerySchema } from "../schemas";

type Props<T extends RouteIds<RegisteredRouter["routeTree"]>> = {
	routeId: T;
};

function SearchArtifactsForm<
	T extends RouteIds<RegisteredRouter["routeTree"]>,
>({ routeId }: Props<T>) {
	const routeApi = getRouteApi<T>(routeId);
	const navigate = useNavigate();
	const search = routeApi.useSearch();

	const query = React.useMemo(() => {
		if (typeof search === "function") {
			return "";
		}

		if (!("query" in search) || typeof search.query !== "string") {
			return "";
		}

		return search.query;
	}, [search]);

	const form = useAppForm({
		defaultValues: { query },
		validators: {
			onChange: z.object({
				query: QuerySchema,
			}),
		},
		onSubmit: async ({ value }) => {
			await navigate({ to: ".", search: { query: value.query } });
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<form.AppForm>
			<form onSubmit={handleSubmit}>
				<form.AppField
					name="query"
					children={(field) => (
						<field.Field>
							<InputGroup>
								<field.FormControl>
									<InputGroupInput
										placeholder="Search artifacts..."
										name={field.name}
										value={field.state.value}
										onChange={(e) => {
											field.handleChange(e.target.value);
										}}
										onBlur={field.handleBlur}
									/>
								</field.FormControl>
								<InputGroupAddon>
									<SearchIcon />
								</InputGroupAddon>
							</InputGroup>
						</field.Field>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { SearchArtifactsForm };
