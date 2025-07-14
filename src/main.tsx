import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SignUp from './pages/SignUp.tsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element with id "root"');
}
createRoot(rootElement).render(
    <StrictMode>
        <SignUp />
    </StrictMode>
);
