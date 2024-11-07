import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './styles.css';
import App from './App';
import FamilyTaskTracker from './FamilyTaskTracker';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        {/* <FamilyTaskTracker /> */}
        <App />
    </StrictMode>
);