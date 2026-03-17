import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './routes';

// Basename para que las rutas coincidan con Vite base (ej. /royalcanvas/)
const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
