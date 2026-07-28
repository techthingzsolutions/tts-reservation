import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/**
 * Start the mock API. Called from main.jsx only when VITE_USE_MOCK_API is true.
 * Requests that do not match a handler pass through to the network, so a
 * partially-built real API can be mixed in during migration.
 */
export function startMockApi() {
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}
