import { lazy, Suspense, useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { LivesProvider } from "@/contexts/LivesContext"
import { AchievementsProvider } from "@/contexts/AchievementsContext"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AvatarProvider } from "@/components/AvatarProvider"
import { PremiumProvider } from "@/components/PremiumProvider"
import { PrivateRoute } from "@/components/PrivateRoute"
import { Toaster } from "sileo"
import "sileo/styles.css"
import { initAnalytics, pageView, identify, reset } from "@/lib/analytics"
import { initUserScope } from "@/lib/userScope"
import { useAuth } from "@/hooks/useAuth"
import { completeMission } from "@/lib/missions"
import { useUTM } from "@/hooks/useUTM"
import { useInactiveReminder } from "@/hooks/useInactiveReminder"

// Initialize user-scoped localStorage namespacing
initUserScope()

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
const DailyMissions = lazy(() => import("@/pages/DailyMissions"))
const Favorites = lazy(() => import("@/pages/Favorites"))
const Notifications = lazy(() => import("@/pages/Notifications"))
const Premium = lazy(() => import("@/pages/Premium"))
const Achievements = lazy(() => import("@/pages/Achievements"))
const Prompts = lazy(() => import("@/pages/Prompts"))
const PromptChallenge = lazy(() => import("@/pages/PromptChallenge"))
const Subscription = lazy(() => import("@/pages/Subscription"))
const SkillCategoryPage = lazy(() => import("@/pages/SkillCategoryPage"))
const PromptCategoryPage = lazy(() => import("@/pages/PromptCategoryPage"))
const LevelUp = lazy(() => import("@/pages/LevelUp"))
const News = lazy(() => import("@/pages/News"))
const QuickQuiz = lazy(() => import("@/pages/QuickQuiz"))
const Inventory = lazy(() => import("@/pages/Inventory"))
const Store = lazy(() => import("@/pages/Store"))
const Ranking = lazy(() => import("@/pages/Ranking"))
const PromptDetail = lazy(() => import("@/pages/PromptDetail"))
const TemplateDetail = lazy(() => import("@/pages/TemplateDetail"))
const Templates = lazy(() => import("@/pages/Templates"))
const LabResult = lazy(() => import("@/pages/LabResult"))
const QuizResult = lazy(() => import("@/pages/QuizResult"))
const Certificate = lazy(() => import("@/pages/Certificate"))
const Onboarding = lazy(() => import("@/pages/Onboarding"))
const PromptLab = lazy(() => import("@/pages/PromptLab"))
const Lab = lazy(() => import("@/pages/Lab"))
const Missions = lazy(() => import("@/pages/Missions"))
const ModuleExam = lazy(() => import("@/pages/ModuleExam"))
const PromptWars = lazy(() => import("@/pages/PromptWars"))
const PromptAnalyzer = lazy(() => import("@/pages/PromptAnalyzer"))
const PromptEnhancer = lazy(() => import("@/pages/PromptEnhancer"))
const Roadmap = lazy(() => import("@/pages/Roadmap"))
const Settings = lazy(() => import("@/pages/Settings"))
const Community = lazy(() => import("@/pages/Community"))
const Verify = lazy(() => import("@/pages/Verify"))

function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end">
      <div className="text-center">
        <img
          src="/assets/mascot-login-new.png"
          alt="Carregando"
          className="mx-auto mb-4 h-32 w-auto"
        />
        <p className="text-lg font-medium text-primary-dark">Carregando...</p>
      </div>
    </div>
  )
}

// ── Analytics tracker (page views + user identification + UTM capture) ───
function AnalyticsTracker() {
  const location = useLocation()
  const { user } = useAuth()
  // useUTM captures UTM/gclid params on first load and persists to sessionStorage.
  // Subsequent calls from anywhere in the app (e.g. trackSignUp) read from there.
  useUTM()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    pageView(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (user) {
      identify(user.id, {
        email: user.email,
        name: user.user_metadata?.full_name,
      })
    } else {
      reset()
    }
  }, [user?.id])

  return null
}

// ── Activity & Reminder Tracker ───────────────────────────────────────────
function ActivityTracker() {
  // Monitors inactivity, records activity, and triggers push notifications
  // when the user hasn't accessed in 12+ hours and hasn't visited today.
  useInactiveReminder()
  return null
}

// ── Mission Tracker ───────────────────────────────────────────────────────
function MissionTracker() {
  const { user } = useAuth()
  useEffect(() => {
    if (user?.id) completeMission("visit")
  }, [user?.id])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AvatarProvider>
          <PremiumProvider>
        <LivesProvider>
          <AchievementsProvider>
          <AnalyticsTracker />
          <ActivityTracker />
          <MissionTracker />
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
              <Route
                path="/daily-missions"
                element={
                  <PrivateRoute>
                    <DailyMissions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/premium"
                element={
                  <PrivateRoute>
                    <Premium />
                  </PrivateRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <PrivateRoute>
                    <Achievements />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompts"
                element={
                  <PrivateRoute>
                    <Prompts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/challenge"
                element={
                  <PrivateRoute>
                    <PromptChallenge />
                  </PrivateRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                }
              />
              <Route
                path="/learn/category/:categoryId"
                element={
                  <PrivateRoute>
                    <SkillCategoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompts/category/:categoryId"
                element={
                  <PrivateRoute>
                    <PromptCategoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/level-up"
                element={
                  <PrivateRoute>
                    <LevelUp />
                  </PrivateRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <PrivateRoute>
                    <News />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <PrivateRoute>
                    <QuickQuiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <PrivateRoute>
                    <Inventory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/store"
                element={
                  <PrivateRoute>
                    <Store />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ranking"
                element={
                  <PrivateRoute>
                    <Ranking />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz-result"
                element={
                  <PrivateRoute>
                    <QuizResult />
                  </PrivateRoute>
                }
              />
              <Route
                path="/certificate"
                element={
                  <PrivateRoute>
                    <Certificate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompt/:promptId"
                element={
                  <PrivateRoute>
                    <PromptDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <PrivateRoute>
                    <Templates />
                  </PrivateRoute>
                }
              />
              <Route
                path="/template/:templateId"
                element={
                  <PrivateRoute>
                    <TemplateDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/lab-result"
                element={
                  <PrivateRoute>
                    <LabResult />
                  </PrivateRoute>
                }
              />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route
                path="/lab"
                element={
                  <PrivateRoute>
                    <Lab />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompt-lab"
                element={
                  <PrivateRoute>
                    <PromptLab />
                  </PrivateRoute>
                }
              />
              <Route
                path="/missions"
                element={
                  <PrivateRoute>
                    <Missions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/module-exam"
                element={
                  <PrivateRoute>
                    <ModuleExam />
                  </PrivateRoute>
                }
              />              <Route path="/prompt-wars"
                element={
                  <PrivateRoute>
                    <PromptWars />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompt-analyzer"
                element={
                  <PrivateRoute>
                    <PromptAnalyzer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prompt-enhancer"
                element={
                  <PrivateRoute>
                    <PromptEnhancer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <PrivateRoute>
                    <Roadmap />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <PrivateRoute>
                    <Community />
                  </PrivateRoute>
                }
              />
              <Route path="/verify/:id" element={<Verify />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </AchievementsProvider>
        </LivesProvider>
          </PremiumProvider>
        </AvatarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
