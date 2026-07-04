import Landing from "./pages/Landing/Landing"
import Login from "./pages/Auth/Auth"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:id" element={<Workspace />} />
    </Routes>
  )
}

export default App
