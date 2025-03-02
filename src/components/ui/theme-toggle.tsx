"use client";

import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = ({
  className = "",
}: {
  className?: string;
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent hydration errors
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Map the current theme to the next theme
  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  // Determine the icon to display based on the current theme
  const getIcon = () => {
    if (theme === "light") return <SunIcon className="h-5 w-5" />;
    if (theme === "dark") return <MoonIcon className="h-5 w-5" />;
    return <LaptopIcon className="h-5 w-5" />;
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${className}`}
    >
      {getIcon()}
    </button>
  );
};
