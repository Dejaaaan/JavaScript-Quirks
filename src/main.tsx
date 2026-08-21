import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider } from './i18n';
import './index.css';

const clientStartTime = new Date();
console.log(
  `%c⚡ [JS Deep Dive & Quirks Explorer] App Loaded: ${clientStartTime.toISOString()} (${clientStartTime.toLocaleString()})`,
  'background: #18181B; color: #F59E0B; font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 4px;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
