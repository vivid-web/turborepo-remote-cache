import { z } from "zod";

const AddNewUserSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(1024, "Name must be less than 1024 characters"),
	email: z.email(),
});

const RemoveUserSchema = z.object({
	id: z.string(),
});

const SearchSchema = z.object({
	query: z.string().optional(),
});

type AddNewUserInput = z.input<typeof AddNewUserSchema>;

type RemoveUserInput = z.input<typeof RemoveUserSchema>;

type SearchInput = z.input<typeof SearchSchema>;

export { AddNewUserSchema, RemoveUserSchema, SearchSchema };

export type { AddNewUserInput, RemoveUserInput, SearchInput };
