
import { useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AnswerList({ answers, reload }) {
  const { auth } = useContext(AuthContext);

  const deleteAnswer = async (id) => {
    try {
      await api.delete(`/admin/answer/${id}`);
      reload();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {answers.map((ans) => (


        // <div
        //   key={ans._id}
        //   className="bg-gray-100 px-3 py-2 rounded flex justify-between items-start"
        // >
        //   <span className="text-sm">{ans.text}</span>

        //   {auth?.user?.role === "admin" && (
        //     <button
        //       onClick={() => deleteAnswer(ans._id)}
        //       className="text-red-500 text-xs ml-2  cursor-pointer"
        //     >
        //       Delete
        //     </button>
        //   )}
        // </div>


        <div
  key={ans._id}
  className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-start"
>
  <div className="flex gap-3">
    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
      {ans.userId?.name?.charAt(0).toUpperCase()}
    </div>

    <div>
      <p className="font-semibold text-gray-800">
        {ans.userId?.name}
      </p>

      <p className="text-gray-700 mt-1">
        {ans.text}
      </p>
    </div>
  </div>

  {auth?.user?.role === "admin" && (
    <button
      onClick={() => deleteAnswer(ans._id)}
      className="text-red-500 text-sm"
    >
      Delete
    </button>
  )}
</div>






      ))}
    </div>
  );
}
