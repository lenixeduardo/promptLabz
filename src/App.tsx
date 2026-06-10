import { Routes, Route } from "react-router-dom"
import Hero from "@/pages/Hero"
import Login from "@/pages/Login"
import Home from "@/pages/Home"
import LearningLab from "@/pages/LearningLab"
import Skills from "@/pages/Skills"
import MissionComplete from "@/pages/MissionComplete"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/learn" element={<LearningLab />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/mission" element={<MissionComplete />} />
    </Routes>
  )
}
