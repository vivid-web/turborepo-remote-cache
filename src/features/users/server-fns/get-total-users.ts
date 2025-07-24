import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";

import { auth } from "@/middlewares/auth";

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

export { getTotalUsers };
