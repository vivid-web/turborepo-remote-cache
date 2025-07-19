import { z } from "zod";

const ParamsSchema = z.object({
	userId: z.string().min(1),
});

type ParamsInput = z.input<typeof ParamsSchema>;

export { ParamsSchema };

export type { ParamsInput };
