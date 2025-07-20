import { z } from "zod";

const EditUserSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(1, "Name is required")
		.max(1024, "Name must be less than 1024 characters"),
	email: z.email(),
});

const ParamsSchema = z.object({
	userId: z.string().min(1),
});

type EditUserInput = z.input<typeof EditUserSchema>;

type ParamsInput = z.input<typeof ParamsSchema>;

export { EditUserSchema, ParamsSchema };

export type { EditUserInput, ParamsInput };
