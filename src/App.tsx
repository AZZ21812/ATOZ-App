import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./pages/LoginForm";
import  Homepage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard"
import { Transactions } from "./pages/Transactions";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";
import { useAuth } from "./auth/Authcontex";
import Register from "./pages/Register";

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => logout();

  return (
    <div className="flex flex-col min-h-screen">
      <div >
        <Routes>
          <Route path="/homepage" element = {<Homepage/>} />
          <Route path="/register" element = {<Register/>} />

    
          <Route path="/login" element={<LoginForm />} />

         

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route
            path="*"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/homepage" replace />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
