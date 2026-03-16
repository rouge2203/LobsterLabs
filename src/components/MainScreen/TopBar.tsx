import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

export function TopBar({
  desktop = false,
  onMenuClick,
  onLogoClick,
  showFlags = true,
  dialogOpen = false,
}: {
  desktop?: boolean;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  showFlags?: boolean;
  dialogOpen?: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const flagSize = "w-6 h-6";

  return (
    <div
      className={`relative flex items-center justify-between ${
        desktop
          ? "px-8 h-16 w-full z-50 bg-white"
          : "px-4 pt-1 pb-1 min-h-[44px] z-50 bg-white"
      }`}
    >
      {desktop ? (
        <>
          <button
            className="p-2 -ml-2 flex-shrink-0"
            aria-label="Menu"
            type="button"
            onClick={onMenuClick}
          >
            <svg
              className="w-5 h-5 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onLogoClick}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img src="/lobsterlogo.png" alt="Lobster Labs" className="h-6" />
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            {showFlags && (
              <LanguageToggleButtons
                language={language}
                setLanguage={setLanguage}
                flagSize={flagSize}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <button
            className="p-2 -ml-2 flex-shrink-0"
            aria-label="Menu"
            type="button"
            onClick={onMenuClick}
          >
            <svg
              className="w-5 h-5 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onLogoClick}
            className="flex-1 flex justify-center"
          >
            <img
              src="/lobsterlogo.png"
              alt="Lobster Labs"
              className="h-5 object-contain"
            />
          </button>
          {showFlags ? (
            <div className="flex items-center gap-1 w-12 justify-end flex-shrink-0">
              <LanguageToggleButtons
                language={language}
                setLanguage={setLanguage}
                flagSize={flagSize}
              />
            </div>
          ) : (
            <div className="w-12 flex-shrink-0" />
          )}
        </>
      )}
    </div>
  );
}

function LanguageToggleButtons({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  flagSize?: string;
}) {
  return (
    <div className="flex items-center bg-gray-100/80 rounded-full p-0.5">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full text-xs font-inter font-medium tracking-wide transition-all duration-200 ${
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
        className={`px-2.5 py-1 rounded-full text-xs font-inter font-medium tracking-wide transition-all duration-200 ${
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
