import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { TutorialProvider } from './contexts/TutorialContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TutorialProvider>
      <App />
    </TutorialProvider>
  </StrictMode>,
);
