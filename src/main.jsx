import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

/**
 * The mock API must be running before React mounts, otherwise the first
 * queries fire against a network that is not intercepted yet.
 */
async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { startMockApi } = await import('./mocks/browser');
    await startMockApi();
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
