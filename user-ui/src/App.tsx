import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing/Landing"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import Auth from "./pages/Auth/Auth"
import NotFound from "./pages/NotFound/Oops"
import { useAuth } from "./contexts/AuthContext"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />

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
