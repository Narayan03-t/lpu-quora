import { useState } from "react";
import api from "../api/axios";

export default function AskModal({ open, onClose, reload }) {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    tag: "exams",
  });

  const postQuestion = async () => {
    if (!form.title.trim()) return;
    await api.post("/questions", form);
    reload();
    onClose();
    setForm({ title: "", desc: "", tag: "exams" });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-5 rounded-lg">
        <h2 className="text-lg font-bold text-center text-orange-500 mb-4">
          Ask a Question
        </h2>

        <input
          placeholder="Title"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
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
