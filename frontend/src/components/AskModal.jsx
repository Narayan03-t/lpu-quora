import { useState } from "react";
import api from "../api/axios";

export default function AskModal({ open, onClose, reload }) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    tag: "exams",
  });
  const [error, setError] = useState("");

  const postQuestion = async () => {
    const title = form.title.trim();
    const desc = form.desc.trim();

    if (title.length < 5) {
      setError("Question title must be at least 5 characters.");
      return;
    }

    if (desc.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    try {
      setError("");
      await api.post("/questions", { ...form, title, desc });
      reload();
      onClose();
      setForm({ title: "", desc: "", tag: "exams" });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your login session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.errors?.join(" ") ||
            err.response?.data?.message ||
            "Unable to post the question. Please try again."
        );
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-5 rounded-lg">
        <h2 className="text-lg font-bold text-center text-orange-500 mb-4">
          Ask a Question
        </h2>

        {error && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          placeholder="Title"
          className="w-full border p-2 mb-2 rounded"
          value={form.title}
          onChange={(e) => {
            setError("");
            setForm({ ...form, title: e.target.value });
          }}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-2 rounded"
          value={form.desc}
          onChange={(e) => {
            setError("");
            setForm({ ...form, desc: e.target.value });
          }}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        >
          <option value="exams">Exams</option>
          <option value="hostel">Hostel</option>
          <option value="events">Events</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded  cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={postQuestion}
            className="px-4 py-1 bg-orange-500 text-white rounded cursor-pointer"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
