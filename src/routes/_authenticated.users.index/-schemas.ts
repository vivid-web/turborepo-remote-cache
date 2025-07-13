import { z } from "zod";

const SearchSchema = z.object({
	query: z.string().optional(),
});

type SearchInput = z.input<typeof SearchSchema>;

export { SearchSchema };

export type { SearchInput };
