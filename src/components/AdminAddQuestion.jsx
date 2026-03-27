import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const API_URL = "https://quiz-backend-05h6.onrender.com"; 

const CATEGORIES = ["HTML", "JavaScript", "React", "C++", "Python"];

export default function AdminAddQuestion() {
  const { user } = useAuth();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState("HTML");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateOption(index, value) {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  }

  function resetForm() {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setCategory("HTML");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.token) {
      setError("You must be logged in");
      return;
    }

    if (!question.trim()) {
      setError("Question cannot be empty");
      return;
    }

    if (options.some((o) => !o.trim())) {
      setError("All options are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess("Question added successfully 🎉");
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-1 text-indigo-900">
        Add New Question
      </h2>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded">
          <FaCheckCircle /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question..."
          className="w-full p-3 border rounded"
        />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="radio"
              checked={correctAnswer === i}
              onChange={() => setCorrectAnswer(i)}
            />
            <input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded"
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
}