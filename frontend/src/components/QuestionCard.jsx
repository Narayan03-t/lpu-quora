




import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import AnswerList from "./AnswerList";

export default function QuestionCard({ q, reload }) {
  const { auth } = useContext(AuthContext);
  const [answer, setAnswer] = useState("");
  const [showAll, setShowAll] = useState(false);

  // ✅ SUBMIT ANSWER
  const submitAnswer = async () => {
    if (!answer.trim()) return;

    try {
      await api.post(`/questions/${q._id}/answer`, {
        text: answer, 
      });

      setAnswer(""); // clear input
      reload();      // refresh questions
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ DELETE QUESTION (ADMIN)
  const deleteQuestion = async () => {
    try {
      await api.delete(`/admin/question/${q._id}`);
      reload();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ SHOW ONLY LAST 2 ANSWERS INITIALLY
  const visibleAnswers = showAll
    ? q.answers
    : q.answers?.slice(0, 2);

  return (
    <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">{q.title}</h3>


        {auth?.user?.role === "admin" && (
  <button
    onClick={deleteQuestion}
    className="text-red-500 text-sm"
  >
    Delete
  </button>
)}




      </div>



      <p className="text-gray-600 text-sm">{q.desc}</p>

      <span className="inline-block mt-2 bg-purple-200 px-2 py-0.5 rounded text-xs">
        {q.tag}
      </span>

      {/* ✅ ANSWER INPUT */}
      <div className="mt-3 flex gap-2">
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write an answer..."
          className="flex-1 border px-2 py-1 rounded text-sm"
        />
        <button
          onClick={submitAnswer}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          Answer
        </button>
      </div>

      {/* ✅ ANSWERS LIST */}
      {q.answers?.length > 0 && (
        <>
          <AnswerList answers={visibleAnswers} reload={reload} />

          {q.answers.length > 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-orange-500 text-sm mt-2"
            >
              {showAll ? "Show less" : "Show more"}
            </button>
          )}


        </>
      )}
    </div>
  );
}
