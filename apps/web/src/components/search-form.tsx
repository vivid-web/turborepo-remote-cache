import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { useSpinDelay } from "spin-delay";
import { z } from "zod";

import { useAppForm } from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const FormDataSchema = z.object({
	query: z.string().nullable(),
});

type FormData = z.output<typeof FormDataSchema>;

const FORM_DEBOUNCE_MS = 500;
const SPIN_DELAY_MS = 400;
const SPIN_MIN_DURATION_MS = 300;

type RouteIdWithQuery =
	| "/_authenticated/artifacts/"
	| "/_authenticated/teams/"
	| "/_authenticated/users/";

type Props = Omit<
	React.ComponentProps<typeof InputGroupInput>,
	"name" | "onBlur" | "onChange" | "value"
> & {
	routeId: RouteIdWithQuery;
};

function SearchForm({ routeId, ...props }: Props) {
	const navigate = useNavigate();
	const query = useSearch({
		from: routeId,
		select: (state) => state.query ?? null,
	});

	const mutation = useMutation({
		mutationFn: async (data: FormData) => {
			const query = data.query ?? undefined;

			return navigate({
				to: ".",
				search: (curr) => ({ ...curr, query }),
			});
		},
	});

	const isPending = useSpinDelay(mutation.isPending, {
		delay: SPIN_DELAY_MS,
		minDuration: SPIN_MIN_DURATION_MS,
	});

	const form = useAppForm({
		defaultValues: { query },
		validators: {
			onChange: FormDataSchema,
		},
		onSubmit: ({ value }) => {
			mutation.mutate(value);
		},
		listeners: {
			onChangeDebounceMs: FORM_DEBOUNCE_MS,
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
					name="query"
					children={(field) => (
						<field.Field>
							<InputGroup>
								<field.FormControl>
									<InputGroupInput
										{...props}
										name={field.name}
										value={field.state.value ?? undefined}
										onChange={(e) => {
											field.handleChange(e.target.value || null);
										}}
										onBlur={field.handleBlur}
									/>
								</field.FormControl>
								<InputGroupAddon>
									{isPending ? <Spinner /> : <SearchIcon />}
								</InputGroupAddon>
							</InputGroup>
						</field.Field>
					)}
				/>
			</form>
		</form.AppForm>
	);
}

export { SearchForm };
