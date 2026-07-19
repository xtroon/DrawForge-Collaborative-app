import Landing from "./pages/Landing/Landing"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import { Routes, Route, Navigate } from "react-router-dom"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:id" element={<Workspace />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
