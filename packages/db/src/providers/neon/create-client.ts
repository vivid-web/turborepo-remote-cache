import { neon } from "@neondatabase/serverless";

type Options = {
	connectionString: string;
};

export function createClient({ connectionString }: Options) {
	return neon(connectionString);
}

export type Client = ReturnType<typeof createClient>;
