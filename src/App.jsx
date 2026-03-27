import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Result from "./components/ResultScreen";
import Leaderboard from "./components/Leaderboard";
import GlobalLeaderboard from "./components/GlobalLeaderboard";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Profile from "./components/Profile";

export default function App() {
  const [score, setScore] = useState(0);

  function restartQuiz() {
    setScore(0);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Navbar */}
      <Navbar score={score} />

      {/* Main Content */}
      <main className="flex-1 flex justify-center pt-24 px-4">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Quiz */}
          <Route
            path="/quiz"
            element={<Quiz score={score} setScore={setScore} />}
          />

          {/* Result */}
          <Route
            path="/result"
            element={<Result score={score} onRestart={restartQuiz} />}
          />

          {/* Leaderboards */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/leaderboard/global"
            element={<GlobalLeaderboard />}
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protect Profile (optional but better) */}
          <Route
            path="/profile"
            element={
              <ProtectedAdmin fallback={<Login />}>
                <Profile />
              </ProtectedAdmin>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}