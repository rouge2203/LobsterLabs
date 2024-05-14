import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  // Function to get the initial theme based on system preference
  const getInitialTheme = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default to 'light' if matchMedia is not supported
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Effect to listen for changes in system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen ${theme} dark:bg-zinc-900 bg-zinc-300`}
    >
      <main className="flex-grow relative">
        <Outlet context={{ theme, toggleTheme }} />
      </main>
    </div>
  );
}

export default App;
