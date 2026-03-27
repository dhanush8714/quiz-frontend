import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTrophy } from "react-icons/fa";

const API_URL = "https://quiz-backend-05h6.onrender.com"; // 

export default function Leaderboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }

    async function fetchAttempts() {
      try {
        const res = await fetch(`${API_URL}/api/attempts/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        // ✅ FIX: safe handling
        if (Array.isArray(data)) {
          setAttempts(data.slice(0, 5));
        } else {
          console.error("Invalid response:", data);
          setAttempts([]);
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAttempts();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white max-w-md mx-auto p-6 rounded-xl shadow text-center">
        <p className="text-yellow-500 text-lg">
          Login to see your quiz attempts
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white max-w-md mx-auto p-6 rounded-xl shadow text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white max-w-md mx-auto p-6 rounded-xl shadow">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-indigo-900">
        <FaTrophy className="text-yellow-500 text-xl" />
        Your Latest Attempts
      </h2>

      {attempts.length === 0 ? (
        <p className="text-gray-500">No attempts yet</p>
      ) : (
        attempts.map((a) => (
          <div
            key={a._id}
            className="flex justify-between py-2 border-b text-sm"
          >
            <div>
              <p className="font-medium">{a.category}</p>
              <p className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="font-semibold">
              {a.score}/{a.total}
            </span>
          </div>
        ))
      )}
    </div>
  );
}