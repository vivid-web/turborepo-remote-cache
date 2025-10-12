import type {
	Client as LocalClient,
	Database as LocalDatabase,
} from "./providers/local/index.js";
import type {
	Client as NeonClient,
	Database as NeonDatabase,
} from "./providers/neon/index.js";

export type Client = LocalClient | NeonClient;

export type Database = LocalDatabase | NeonDatabase;
