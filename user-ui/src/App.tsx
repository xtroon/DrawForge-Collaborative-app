import Landing from "./pages/Landing/Landing"
import Login from "./pages/Auth/Auth"
import Dashboard from "./pages/Dashboard/Dashboard"
import Workspace from "./pages/Workspace/Workspace"
import { Routes, Route } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import axios from "axios"

function App() {
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      // Sync Clerk user with our backend
      axios.post("http://localhost:5000/api/auth/clerk-login", {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        picture: user.imageUrl
      }).then(res => {
        console.log("User synced with backend:", res.data)
      }).catch(err => {
        console.error("Failed to sync user with backend", err)
      })
    }
  }, [isSignedIn, user])

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
