import { getRouteApi } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const SearchFormSchema = z.object({
	query: z.string(),
});

const route = getRouteApi("/_authenticated/users/");

function SearchUsersForm() {
	const search = route.useSearch();
	const navigate = route.useNavigate();

	const form = useAppForm({
		defaultValues: { query: search.query ?? "" },
		validators: {
			onChange: SearchFormSchema,
		},
		onSubmit: async ({ value }) => {
			await navigate({
				search: (curr) => ({ ...curr, query: value.query || undefined }),
			});
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
						<field.FormItem className="relative w-64">
							<field.FormLabel className="absolute top-1/2 left-3 -translate-y-1/2 transform text-muted-foreground">
								<SearchIcon className="h-4 w-4" />
							</field.FormLabel>
							<field.FormControl>
								<Input
									placeholder="Search users..."
									className="pl-10"
									onChange={(e) => {
										field.handleChange(e.target.value);
									}}
									onBlur={field.handleBlur}
									value={field.state.value}
								/>
							</field.FormControl>
						</field.FormItem>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { SearchUsersForm };
