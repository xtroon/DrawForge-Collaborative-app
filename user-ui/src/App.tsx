import Landing from "./pages/Landing/Landing"
import Login from "./pages/Auth/Auth"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

function App() {
  const { isAuthenticated, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6]">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/board/:id" element={isAuthenticated ? <Workspace /> : <Navigate to="/auth" />} />
    </Routes>
  )
}

export default App
