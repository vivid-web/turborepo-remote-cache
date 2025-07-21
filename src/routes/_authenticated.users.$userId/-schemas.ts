import { z } from "zod";

import { IdSchema } from "@/lib/schemas";

const EditUserSchema = z.object({
	id: IdSchema,
	name: z
		.string()
		.min(1, "Name is required")
		.max(1024, "Name must be less than 1024 characters"),
	email: z.email(),
});

const ParamsSchema = z.object({
	userId: IdSchema,
});

type EditUserInput = z.input<typeof EditUserSchema>;

type ParamsInput = z.input<typeof ParamsSchema>;

export { EditUserSchema, ParamsSchema };

export type { EditUserInput, ParamsInput };
