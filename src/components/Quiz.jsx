import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiClock } from "react-icons/fi";

const API_URL = "https://quiz-backend-05h6.onrender.com";

export default function Quiz({ score, setScore }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const selectedCategory = location.state?.category || "HTML";

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(15);
  const [loading, setLoading] = useState(true);

  // 🔀 Shuffle
  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 📥 Fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setCurrent(0);
      setSelected(null);
      setTime(15);
      setScore(0);

      try {
        const res = await fetch(
          `${API_URL}/api/questions/${encodeURIComponent(selectedCategory)}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setQuestions(shuffleArray(data));
        } else {
          console.error("Invalid response:", data);
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to load questions", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [selectedCategory, setScore]);

  // ⏱ Timer
  useEffect(() => {
    if (selected !== null || loading) return;

    if (time === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, selected, loading]);

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  // 🎯 Click
  function handleOptionClick(index) {
    if (selected !== null) return;

    setSelected(index);

    if (index === Number(currentQuestion.correctAnswer)) {
      setScore((prev) => prev + 1);
    }
  }

  // ➡️ Next
  async function handleNext() {
    setSelected(null);
    setTime(15);

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      if (user?.token) {
        try {
          await fetch(`${API_URL}/api/attempts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              category: selectedCategory,
              score,
              total: questions.length,
            }),
          });
        } catch (err) {
          console.error("Failed to save attempt", err);
        }
      }

      navigate("/result", {
        state: {
          category: selectedCategory,
          score,
          total: questions.length,
        },
      });
    }
  }

  // Loading
  if (loading) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (!questions.length) {
    return <div>No questions found</div>;
  }

  return (
    <div className="bg-white w-[340px] p-6 rounded-xl shadow-lg">
      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-2 bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between mb-3 text-sm text-gray-500">
        <span>
          {selectedCategory} • {current + 1}/{questions.length}
        </span>
        <span className="text-red-500 flex items-center gap-1">
          <FiClock /> {time}s
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold mb-4">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => {
          let style = "w-full px-4 py-2 border rounded transition";

          if (selected !== null) {
            if (index === Number(currentQuestion.correctAnswer)) {
              style += " bg-green-500 text-white"; // ✅ correct
            } else if (index === selected) {
              style += " bg-red-500 text-white"; // ❌ wrong
            } else {
              style += " opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={style}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Next */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          {current === questions.length - 1 ? "Finish Quiz" : "Next"}
        </button>
      )}
    </div>
  );
}