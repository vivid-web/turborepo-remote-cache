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

type Props = {
	onSearch: (query?: string) => Promise<void> | void;
	query?: string | undefined;
};

function SearchTeamsForm({ query, onSearch }: Props) {
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
						<field.FormItem>
							<InputGroup>
								<field.FormControl>
									<InputGroupInput
										placeholder="Search teams..."
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
						</field.FormItem>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { SearchTeamsForm };
