import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './routes';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <EnvironmentProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </EnvironmentProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
