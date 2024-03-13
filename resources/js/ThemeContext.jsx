import { createContext, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import Cookies from "js-cookie";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const TRANSITION_DURATION = "2s";

  const modeProperties = {
    darkMode: {
      backgroundPureCss: "dark-background",
      background: `bg-gray-700 transition-[background] duration-[${TRANSITION_DURATION}]`,
      container: `bg-gray-800 transition-[background] duration-[${TRANSITION_DURATION}]`,
      text: "text-gray-100",
      labelText: "text-gray-700",
      border: "border-gray-100",
      contrastBackground: `bg-gray-100 transition-[background] duration-[${TRANSITION_DURATION}]`,
      contrastText: "text-gray-700",
    },
    lightMode: {
      backgroundPureCss: "light-background",
      background: `bg-gray-100 transition-[background] duration-[${TRANSITION_DURATION}]`,
      container: `bg-white transition-[background] duration-[${TRANSITION_DURATION}]`,
      text: "text-gray-700",
      labelText: "text-gray-100",
      border: "border-gray-700",
      contrastBackground: `bg-gray-700 transition-[background] duration-[${TRANSITION_DURATION}]`,
      contrastText: "text-gray-100",
    },
  };
  const [darkMode, setDarkMode] = useState(Cookies.get("darkMode") === "true");
  const changeMode = () => {
    setDarkMode((prev) => !prev);
    Cookies.set("darkMode", !darkMode);

    if (darkMode) {
      document.body.classList.add(modeProperties.lightMode.backgroundPureCss);
      document.body.classList.remove(modeProperties.darkMode.backgroundPureCss);
    } else {
      document.body.classList.add(modeProperties.darkMode.backgroundPureCss);
      document.body.classList.remove(
        modeProperties.lightMode.backgroundPureCss,
      );
    }
  };

  const value = {
    properties: darkMode ? modeProperties.darkMode : modeProperties.lightMode,
    changeMode: changeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};