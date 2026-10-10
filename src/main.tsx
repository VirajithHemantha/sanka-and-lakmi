import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './StoryApp.tsx';
import AdminPage from './AdminPage.tsx';
import ConfirmPage from './ConfirmPage.tsx';
import './index.css';

const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

function RootComponent() {
  if (rawPath === '/admin' || rawPath.startsWith('/admin')) {
    return <AdminPage />;
  }
  if (rawPath === '/confirm' || rawPath.startsWith('/confirm')) {
    return <ConfirmPage />;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
);
