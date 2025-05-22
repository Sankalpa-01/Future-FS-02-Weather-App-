import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './components/FavoritesContext.jsx';

createRoot(document.getElementById('root')).render(
    <FavoritesProvider>
        <App />
    </FavoritesProvider>
)
