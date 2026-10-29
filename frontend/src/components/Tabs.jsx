export default function Tabs({ active, setActive }) {
  const tabs = ["all", "exams", "hostel", "events"];

  return (
    <div className="flex gap-6 border-b mb-6 text-sm">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`pb-2 font-semibold ${
            active === t
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
