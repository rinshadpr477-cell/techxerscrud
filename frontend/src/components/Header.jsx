export default function Header() {
  const badges = [
    { label: 'React CRUD', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'REST API', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Database Connected', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 py-3"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-slate-800 font-semibold text-base">Dashboard</h1>
          <p className="text-slate-400 text-xs">Full-stack React CRUD Application</p>
        </div>

        {/* Right: Status Badges */}
        <div className="flex items-center gap-2">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
