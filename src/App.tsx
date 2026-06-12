import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { LivesProvider } from "@/contexts/LivesContext"
import { AchievementsProvider } from "@/contexts/AchievementsContext"
import { PrivateRoute } from "@/components/PrivateRoute"
import { Toaster } from "sileo"
import "sileo/styles.css"

const Hero = lazy(() => import("@/pages/Hero"))
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"))
const AuthCallback = lazy(() => import("@/pages/AuthCallback"))
const ResetPassword = lazy(() => import("@/pages/ResetPassword"))
const Home = lazy(() => import("@/pages/Home"))
const Profile = lazy(() => import("@/pages/Profile"))
const AvatarScreen = lazy(() => import("@/pages/AvatarScreen"))
const LearningLab = lazy(() => import("@/pages/LearningLab"))
const Lesson = lazy(() => import("@/pages/Lesson"))
const Skills = lazy(() => import("@/pages/Skills"))
const SkillDetail = lazy(() => import("@/pages/SkillDetail"))
const MissionComplete = lazy(() => import("@/pages/MissionComplete"))
const Achievements = import.meta.env.DEV
  ? lazy(() => import("@/pages/Achievements"))
  : () => null

function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      <div className="text-center">
        <img
          src="/assets/mascot-login-new.png"
          alt="Carregando"
          className="mx-auto mb-4 h-32 w-auto"
        />
        <p className="text-lg font-medium text-[#2B5D3A]">Carregando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LivesProvider>
        <AchievementsProvider>
          <Toaster position="top-right" />
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
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
                path="/avatars"
                element={
                  <PrivateRoute>
                    <AvatarScreen />
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
                path="/skill/:skillName"
                element={
                  <PrivateRoute>
                    <SkillDetail />
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
              {/* Achievements page — only in dev mode */}
              {import.meta.env.DEV && (
                <Route
                  path="/achievements"
                  element={
                    <PrivateRoute>
                      <Achievements />
                    </PrivateRoute>
                  }
                />
              )}
            </Routes>
          </Suspense>
        </AchievementsProvider>
      </LivesProvider>
    </AuthProvider>
  )
}
