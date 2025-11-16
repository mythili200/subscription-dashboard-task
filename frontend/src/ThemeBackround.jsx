import React, { useEffect } from "react";
import { useThemeContext } from "./ThemeContext";

export default function ThemeBackground() {
  const { darkMode } = useThemeContext();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1E1E1E" : "#e8dbf2";
    document.body.style.color = darkMode ? "#fff" : "#000"; 
  }, [darkMode]);

  return null; 
}
