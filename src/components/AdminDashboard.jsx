import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaPlusCircle,
  FaUsers,
  FaListAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import AdminAddQuestion from "./AdminAddQuestion";
import AdminUsers from "./AdminUsers";

const API_URL = "https://quiz-backend-05h6.onrender.com"; 

export default function AdminDashboard() {
  const [tab, setTab] = useState("stats");

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage questions, users, and platform content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <aside className="lg:col-span-1 bg-white border rounded-xl p-4">
          <SidebarButton icon={<FaChartBar />} label="Overview" active={tab === "stats"} onClick={() => setTab("stats")} />
          <SidebarButton icon={<FaPlusCircle />} label="Add Question" active={tab === "add"} onClick={() => setTab("add")} />
          <SidebarButton icon={<FaListAlt />} label="All Questions" active={tab === "questions"} onClick={() => setTab("questions")} />
          <SidebarButton icon={<FaUsers />} label="Manage Users" active={tab === "users"} onClick={() => setTab("users")} />
        </aside>

        <main className="lg:col-span-4 bg-white border rounded-xl p-6">
          {tab === "stats" && <Stats />}
          {tab === "add" && <AdminAddQuestion />}
          {tab === "questions" && <ManageQuestions />}
          {tab === "users" && <AdminUsers />}
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-indigo-900 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/questions/admin/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats error:", err);
      }
    }

    fetchStats();
  }, [user]);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-indigo-900">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Questions" value={stats.totalQuestions} />
        <StatCard title="Categories" value={stats.byCategory?.length || 0} />
        <StatCard title="Admins" value="—" />
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="border rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ---------------- Manage Questions ---------------- */

function ManageQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    fetch(`${API_URL}/api/questions/admin/all`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuestions(data);
        else setQuestions([]);
      })
      .catch((err) => console.error(err));
  }, [user]);

  async function deleteQuestion(id) {
    if (!window.confirm("Delete this question?")) return;

    await fetch(`${API_URL}/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    setQuestions((prev) => prev.filter((q) => q._id !== id));
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-indigo-900">
        Question Management
      </h2>

      {questions.map((q) => (
        <div key={q._id} className="border rounded-lg p-4 mb-3">
          <div className="flex justify-between">
            <p>{q.question}</p>

            <button
              onClick={() => deleteQuestion(q._id)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}