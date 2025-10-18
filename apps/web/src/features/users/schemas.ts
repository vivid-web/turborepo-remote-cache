import { z } from "zod";

const EmailSchema = z.email("Email must be a valid email address");

const NameSchema = z
	.string("Name must be a string")
	.min(1, "Name is required")
	.max(1024, "Name must be less than 1024 characters");

export { EmailSchema, NameSchema };
