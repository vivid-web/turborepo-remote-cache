import { env } from "../env.js";
import { createLocalStorage } from "../storage/index.js";

export const storage = createLocalStorage({ basePath: env.LOCAL_STORAGE_PATH });
