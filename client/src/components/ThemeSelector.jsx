import { useThemeStore } from "../store/ThemeSelector";
import { THEMES } from "../configurations/index";

const ThemeSelector = ({ mobile = false, onSelect }) => {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    if (mobile && typeof onSelect === "function") {
      onSelect(); // Close panel after selecting
    }
  };

  if (mobile) {
    return (
      <div className="space-y-1">
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            onClick={() => handleThemeChange(themeOption.name)}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              theme === themeOption.name
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-content/5"
            }`}
          >
            <span className="text-sm font-medium">{themeOption.label}</span>
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Desktop dropdown (trigger icon removed; now controlled externally)
  return (
    <div
      className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
      w-56 border border-base-content/10 max-h-80 overflow-y-auto"
    >
      <div className="space-y-1">
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              theme === themeOption.name
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-content/5"
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <span className="text-sm font-medium">{themeOption.label}</span>
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
