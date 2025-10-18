import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import * as React from "react";
import { z } from "zod";

import { useAppForm } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LimitSchema } from "@/lib/schemas";

const FormDataSchema = z.object({
	limit: LimitSchema,
});

type FormData = z.output<typeof FormDataSchema>;

function LimitSelect() {
	const navigate = useNavigate();
	const limit = useSearch({
		strict: false,
		select: (state) => state.limit ?? 10,
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			return navigate({
				to: ".",
				search: (curr) => ({ ...curr, ...data }),
			});
		},
	});

	const form = useAppForm({
		defaultValues: { limit },
		validators: {
			onChange: FormDataSchema,
		},
		onSubmit: ({ value }) => {
			mutation.mutate(value);
		},
		listeners: {
			onChange: ({ formApi }) => {
				if (!formApi.state.isValid) return;

				mutation.mutate(formApi.state.values);
			},
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
					name="limit"
					children={(field) => (
						<field.Field orientation="horizontal">
							<field.FieldLabel>Results per page</field.FieldLabel>
							<field.FormControl>
								<Select
									value={field.state.value.toString()}
									onValueChange={(value) => {
										field.handleChange(Number.parseInt(value, 10));
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Number of results" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="25">25</SelectItem>
										<SelectItem value="50">50</SelectItem>
									</SelectContent>
								</Select>
							</field.FormControl>
						</field.Field>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { LimitSelect };
