import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { LivesProvider } from "@/contexts/LivesContext"
import { PrivateRoute } from "@/components/PrivateRoute"
import { Toaster } from "sileo"
import "sileo/styles.css"
import Hero from "@/pages/Hero"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import ForgotPassword from "@/pages/ForgotPassword"
import Home from "@/pages/Home"
import LearningLab from "@/pages/LearningLab"
import Lesson from "@/pages/Lesson"
import Skills from "@/pages/Skills"
import MissionComplete from "@/pages/MissionComplete"
import ResetPassword from "@/pages/ResetPassword"
import Profile from "@/pages/Profile"

export default function App() {
  return (
    <AuthProvider>
      <LivesProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <PrivateRoute>
                <LearningLab />
              </PrivateRoute>
            }
          />
          <Route
            path="/lesson"
            element={
              <PrivateRoute>
                <Lesson />
              </PrivateRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <PrivateRoute>
                <Skills />
              </PrivateRoute>
            }
          />
          <Route
            path="/mission"
            element={
              <PrivateRoute>
                <MissionComplete />
              </PrivateRoute>
            }
          />
        </Routes>
      </LivesProvider>
    </AuthProvider>
  )
}
