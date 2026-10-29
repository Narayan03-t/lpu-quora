import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import QuestionCard from "../components/QuestionCard";
import AskModal from "../components/AskModal";

export default function Home() {
  
  const [questions, setQuestions] = useState([]);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const loadQuestions = async () => {
    const res = await api.get("/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const filtered = questions.filter((q) => {
    const matchTag = tab === "all" || q.tag === tab;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.desc.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar onAsk={() => setOpen(true)} search={search} setSearch={setSearch} />

      <div className="pt-28 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Community Questions
          </h1>
          <p className="text-gray-600">
            Explore questions, share knowledge, and connect with the community
          </p>
        </div>

        <div className="mb-8">
          <Tabs active={tab} setActive={setTab} />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No questions found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}



        <div className="space-y-5">
          {filtered.map((q) => (
            <div
              key={q._id}
              className="transform transition-all duration-200 hover:scale-[1.01]"
            >
              <QuestionCard q={q} reload={loadQuestions} />
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Showing {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
        )}
      </div>

      <AskModal open={open} onClose={() => setOpen(false)} reload={loadQuestions} />
    </div>
  );
}