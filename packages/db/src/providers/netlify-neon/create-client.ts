import type { NeonQueryFunction } from "@neondatabase/serverless";

import { neon } from "@netlify/neon";

export function createClient(): NeonQueryFunction<false, false> {
	// @ts-expect-error wtf is going wrong here...
	return neon();
}

export type Client = ReturnType<typeof createClient>;
