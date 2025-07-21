import { z } from "zod";

const IdSchema = z.string("Id must be a string").min(1, "Id is required");

export { IdSchema };
