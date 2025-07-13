import { z } from "zod";

const RemoveUserSchema = z.object({
	id: z.string(),
});

const SearchSchema = z.object({
	query: z.string().optional(),
});

type RemoveUserInput = z.input<typeof RemoveUserSchema>;

type SearchInput = z.input<typeof SearchSchema>;

export { RemoveUserSchema, SearchSchema };

export type { RemoveUserInput, SearchInput };
