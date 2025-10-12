import { z } from "zod";

const QuerySchema = z.string("Query must be a string");

export { QuerySchema };
