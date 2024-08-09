import { useEffect, useState } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="block p-3 bg-violet-800 text-white hover:text-violet-700 hover:bg-white dark:bg-green-800 dark:text-white dark:hover:text-green-800 rounded-full focus:outline-none text-justify"
    >
      {theme === "light" ? (
        <IoMoon className="size-5 md:size-7" />
      ) : (
        <IoSunny className="size-5 md:size-7" />
      )}
    </button>
  );
};

export default ThemeToggle;
