import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Node-side MSW instance used by Vitest (see src/test/setup.js). */
export const server = setupServer(...handlers);
