import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const API_URL = "https://quiz-backend-05h6.onrender.com";

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) return <p className="mt-20 text-center">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const profileImage = user.profileImage
    ? `${API_URL}${user.profileImage}`
    : "https://i.pravatar.cc/150";

  // 🔄 Update profile
  async function handleUpdateProfile(e) {
    e.preventDefault();

    if (!user?.token) return alert("Please login again");

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data));
      refreshUser();

      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  // 🖼 Upload image
  async function handleUploadImage(e) {
    e.preventDefault();

    if (!image) return alert("Select an image first");
    if (!user?.token) return alert("Please login again");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch(`${API_URL}/api/users/profile-image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profileImage: data.profileImage })
      );

      refreshUser();
      alert("Image uploaded ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ❌ Delete image
  async function handleDeleteImage() {
    if (!user?.token) return alert("Please login again");

    try {
      const res = await fetch(`${API_URL}/api/users/profile-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profileImage: "" })
      );

      refreshUser();
      alert("Image removed ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={profileImage}
          className="w-28 h-28 rounded-full object-cover border"
          alt="profile"
        />

        {user?.profileImage && (
          <button
            onClick={handleDeleteImage}
            className="mt-2 text-red-500 flex items-center gap-1"
          >
            <FaTrash /> Remove Image
          </button>
        )}
      </div>

      <form onSubmit={handleUploadImage}>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="w-full mt-2 bg-green-600 text-white py-2 rounded">
          Upload Image
        </button>
      </form>

      <form onSubmit={handleUpdateProfile} className="mt-4">
        <input
          className="w-full mb-2 p-2 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-2 p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}