import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

export function MobileLanguageFlags() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="fixed right-3 flex flex-col gap-0.5 z-10 bg-gray-100/60 backdrop-blur-sm rounded-full p-0.5"
      style={{ bottom: "40%" }}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-inter font-medium tracking-wide transition-all duration-200 ${
          language === "en"
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-inter font-medium tracking-wide transition-all duration-200 ${
          language === "es"
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  );
}
