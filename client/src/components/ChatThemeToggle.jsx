<div className="relative">
  <button
    onClick={() => setOpen(!open)}
    className="px-3 py-1 rounded bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition"
  >
    Theme: {theme}
  </button>

  {open && (
    <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-600 rounded shadow-lg z-50">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => { setTheme(t); setOpen(false); }}
          className={`w-full text-left px-4 py-2 text-sm ${
            theme === t ? "bg-blue-500 text-white" : "text-white hover:bg-gray-700"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )}
</div>
