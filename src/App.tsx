import { Routes, Route } from "react-router-dom"
import Hero from "@/pages/Hero"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import ForgotPassword from "@/pages/ForgotPassword"
import Home from "@/pages/Home"
import LearningLab from "@/pages/LearningLab"
import Lesson from "@/pages/Lesson"
import Skills from "@/pages/Skills"
import MissionComplete from "@/pages/MissionComplete"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/learn" element={<LearningLab />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/mission" element={<MissionComplete />} />
    </Routes>
  )
}
