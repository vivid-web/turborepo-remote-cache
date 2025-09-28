import { add } from "date-fns";
import { z } from "zod";

const NameSchema = z
	.string("Name must be a string")
	.max(1024, "Name must be less than 1024 characters")
	.nullable();

const ExpiresAtSchema = z
	.date("Expires at must be a date")
	.min(new Date(), { error: "Expiration date must be in the future" })
	.max(add(new Date(), { years: 1 }), {
		error: "Expiration date must be within one year",
	})
	.nullable();

export { ExpiresAtSchema, NameSchema };
