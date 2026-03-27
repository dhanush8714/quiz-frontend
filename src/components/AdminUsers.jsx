import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://quiz-backend-05h6.onrender.com"; // 

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch users
  async function fetchUsers() {
    if (!user || !user.token) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid response:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // 🔼 Promote to admin
  async function promoteToAdmin(id) {
    try {
      await fetch(`${API_URL}/api/users/make-admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error("Error promoting user:", err);
    }
  }

  // 🔽 Remove admin
  async function removeAdmin(id) {
    try {
      await fetch(`${API_URL}/api/users/remove-admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error("Error removing admin:", err);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading users...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">
        User Management
      </h2>

      {users.map((u) => (
        <div
          key={u._id}
          className="flex justify-between items-center py-3 border-b last:border-none"
        >
          <div>
            <p className="font-medium">
              {u.name}
              {u._id === user._id && (
                <span className="ml-2 text-xs text-blue-500">
                  (You)
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>

          {u.isAdmin ? (
            u._id === user._id ? (
              <span className="text-sm text-gray-400">Admin</span>
            ) : (
              <button
                onClick={() => removeAdmin(u._id)}
                className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
              >
                Remove Admin
              </button>
            )
          ) : (
            <button
              onClick={() => promoteToAdmin(u._id)}
              className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200"
            >
              Make Admin
            </button>
          )}
        </div>
      ))}
    </div>
  );
}