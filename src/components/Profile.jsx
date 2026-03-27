import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const API_URL = "https://quiz-backend-05h6.onrender.com"; 

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="mt-24 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const profileImage = user.profileImage
    ? `${API_URL}${user.profileImage}`
    : "https://i.pravatar.cc/150";

  // 🔄 Update profile
  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSaving(true);

    try {
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

      localStorage.setItem("userInfo", JSON.stringify(data));
      refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // 🖼 Upload image
  async function handleUploadImage(e) {
    e.preventDefault();
    if (!image) return;

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

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...user, profileImage: data.profileImage })
      );

      refreshUser();
    } catch (err) {
      console.error(err);
    }
  }

  // ❌ Delete image
  async function handleDeleteImage() {
    try {
      await fetch(`${API_URL}/api/users/profile-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...user, profileImage: "" })
      );

      refreshUser();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        Edit Profile
      </h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={profileImage}
          className="w-28 h-28 rounded-full object-cover border"
          alt="profile"
        />

        {user.profileImage && (
          <button
            onClick={handleDeleteImage}
            className="mt-2 text-sm text-red-500 flex items-center gap-1"
          >
            <FaTrash /> Remove Image
          </button>
        )}
      </div>

      {/* Upload */}
      <form onSubmit={handleUploadImage} className="mb-4">
        <label
          htmlFor="profileImage"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-dashed rounded cursor-pointer"
        >
          <FiUpload />
          Choose Image
        </label>

        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="w-full mt-2 bg-green-600 text-white py-2 rounded">
          Upload Image
        </button>
      </form>

      {/* Update */}
      <form onSubmit={handleUpdateProfile}>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={saving}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}