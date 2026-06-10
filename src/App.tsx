import { Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Home from "@/pages/Home"
import LearningLab from "@/pages/LearningLab"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/learn" element={<LearningLab />} />
    </Routes>
  )
}
