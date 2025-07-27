import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { team } from "drizzle/schema";

import { auth } from "@/middlewares/auth";

const getTotalTeams = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(team));

export { getTotalTeams };
