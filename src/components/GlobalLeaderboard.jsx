import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { FaGlobeAsia } from "react-icons/fa"


const API_URL = "https://quiz-backend-05h6.onrender.com";

export default function GlobalLeaderboard() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/attempts/leaderboard`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="text-center p-6">
        Please login to see leaderboard
      </div>
    )
  }

  if (loading) {
    return <div className="text-center p-6">Loading...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 max-w-md mx-auto p-6 rounded-xl shadow">
<h2 className="flex items-center gap-2 text-xl font-bold mb-4 dark:text-white text-indigo-900">
  <FaGlobeAsia className="text-blue-500 animate-spin-slow" />
  Global Leaderboard
</h2>


      {scores.length === 0 ? (
        <p className="text-gray-500">No scores yet</p>
      ) : (
        scores.map((item, index) => (
          <div
            key={item.userId}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <div>
              <p className="font-medium">
                #{index + 1} {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.email}
              </p>
            </div>
            <span className="font-bold">
              {item.bestScore}/{item.total}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
