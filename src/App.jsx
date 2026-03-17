import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './routes';

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <EnvironmentProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </EnvironmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
