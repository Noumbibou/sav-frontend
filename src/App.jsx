import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import CreateTicketPage from './pages/client/CreateTicketPage';
import MyTicketsPage from './pages/client/MyTicketsPage';
import TicketDetailPage from './pages/client/TicketDetailPage';
import SurveyPage from './pages/client/SurveyPage';
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import ResponsableDashboardPage from './pages/responsable/ResponsableDashboardPage';
import AllTicketsPage from './pages/responsable/AllTicketsPage';

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreateTicketPage />} />
      <Route path="/mes-demandes" element={<MyTicketsPage />} />
      <Route path="/tickets/:id" element={<TicketDetailPage />} />
      <Route path="/surveys/:id" element={<SurveyPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute allowedRole="AGENT">
            <AgentDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/dashboard"
        element={
          <ProtectedRoute allowedRole="RESPONSABLE">
            <ResponsableDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
          path="/responsable/tickets"
          element={
            <ProtectedRoute allowedRole="RESPONSABLE">
              <AllTicketsPage />
            </ProtectedRoute>
          }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;