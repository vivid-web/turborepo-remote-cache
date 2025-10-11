import type {
	Client as LocalClient,
	Database as LocalDatabase,
} from "./providers/local/index.js";
import type {
	Client as NetlifyNeonClient,
	Database as NetlifyNeonDatabase,
} from "./providers/netlify-neon/index.js";

export type Client = LocalClient | NetlifyNeonClient;

export type Database = LocalDatabase | NetlifyNeonDatabase;
