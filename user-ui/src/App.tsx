import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing/Landing"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import Auth from "./pages/Auth/Auth"
import NotFound from "./pages/NotFound/Oops"
import { useAuth } from "./contexts/AuthContext"
import type { ReactNode } from "react"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/board/:id" 
        element={<Workspace />} 
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
