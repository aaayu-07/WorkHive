import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: 'var(--color-surface-bg)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border-color)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Protected Routes inside AppLayout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="users" element={<Users />} />
              {/* Activity page can be added similarly, omitting for brevity */}
            </Route>

            {/* Fallback to root if not found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
