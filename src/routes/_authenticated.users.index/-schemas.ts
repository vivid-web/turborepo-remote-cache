import { z } from "zod";

const RemoveUserSchema = z.object({
	id: z.string(),
});

type RemoveUserInput = z.input<typeof RemoveUserSchema>;

export { RemoveUserSchema };

export type { RemoveUserInput };
