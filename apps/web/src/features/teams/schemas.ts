import { z } from "zod";

import { SLUG_REGEX } from "./constants";

const NameSchema = z
	.string("Name must be a string")
	.min(1, "Name is required")
	.max(1024, "Name must be less than 1024 characters");

const SlugSchema = z
	.string("Slug must be a string")
	.regex(SLUG_REGEX, "Invalid slug format")
	.min(1, "Slug is required")
	.max(1024, "Slug must be less than 1024 characters");

const DescriptionSchema = z
	.string("Description must be a string")
	.max(1024, "Description must be less than 1024 characters")
	.nullable();

const QuerySchema = z.string("Query must be a string");

export { DescriptionSchema, NameSchema, QuerySchema, SlugSchema };
