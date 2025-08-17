import { SearchIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { QuerySchema } from "../schemas";

type Props = {
	onSearch: (query?: string) => Promise<void> | void;
	query?: string | undefined;
};

function SearchArtifactsForm({ query, onSearch }: Props) {
	const form = useAppForm({
		defaultValues: { query },
		validators: {
			onChange: z.object({
				query: QuerySchema,
			}),
		},
		onSubmit: async ({ value }) => {
			await onSearch(value.query || undefined);
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
							<field.FormLabel className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform">
								<SearchIcon className="h-4 w-4" />
							</field.FormLabel>
							<field.FormControl>
								<Input
									placeholder="Search artifacts..."
									className="pl-10"
									name={field.name}
									value={field.state.value}
									onChange={(e) => {
										field.handleChange(e.target.value);
									}}
									onBlur={field.handleBlur}
								/>
							</field.FormControl>
						</field.FormItem>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { SearchArtifactsForm };
