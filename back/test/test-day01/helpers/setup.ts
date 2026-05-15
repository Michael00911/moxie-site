import { config } from 'dotenv';
import { resolve } from 'node:path';

// 优先 .env.test，回退 .env.local
config({ path: resolve(process.cwd(), '.env.test'), override: false });
config({ path: resolve(process.cwd(), '.env.local'), override: false });
